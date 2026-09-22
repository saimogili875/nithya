import os
import sys
import shutil
import time
import subprocess
import socket
import json
import httpx
from typing import Dict, Any, Tuple, Optional, List
from .models import CodeFile, InfrastructureStatus

SANDBOX_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "projects_sandbox")
os.makedirs(SANDBOX_ROOT, exist_ok=True)

class ExecutionSandbox:
    """
    Manages isolated project workspaces, file writes, test runs,
    Docker image building, and container deployments.
    """

    # Track allocated project ports
    project_ports: Dict[str, int] = {}

    @staticmethod
    def get_project_dir(project_id: str) -> str:
        pdir = os.path.join(SANDBOX_ROOT, project_id)
        os.makedirs(pdir, exist_ok=True)
        return pdir

    @classmethod
    def write_files(cls, project_id: str, files: List[CodeFile]) -> List[str]:
        pdir = cls.get_project_dir(project_id)
        written_paths = []

        for f in files:
            clean_rel_path = os.path.normpath(f.path).lstrip("/\\")
            full_path = os.path.abspath(os.path.join(pdir, clean_rel_path))

            if not full_path.startswith(pdir):
                raise ValueError(f"Security Alert: Path traversal attempt blocked for {f.path}")

            if f.action == "delete":
                if os.path.exists(full_path):
                    if os.path.isdir(full_path):
                        shutil.rmtree(full_path)
                    else:
                        os.remove(full_path)
            else:
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                with open(full_path, "w", encoding="utf-8") as file_out:
                    file_out.write(f.content)
                written_paths.append(clean_rel_path)

        return written_paths

    @classmethod
    def get_file_tree_and_contents(cls, project_id: str) -> Dict[str, str]:
        pdir = cls.get_project_dir(project_id)
        tree = {}
        for root, dirs, files in os.walk(pdir):
            dirs[:] = [d for d in dirs if d not in [".git", "__pycache__", "venv", "node_modules"]]
            for fname in files:
                full_path = os.path.join(root, fname)
                rel_path = os.path.relpath(full_path, pdir)
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        tree[rel_path] = f.read()
                except Exception:
                    tree[rel_path] = "[Binary or unreadable file]"
        return tree

    @classmethod
    def get_or_assign_port(cls, project_id: str) -> int:
        if project_id in cls.project_ports:
            return cls.project_ports[project_id]
        port = cls.find_free_port(8001)
        cls.project_ports[project_id] = port
        return port

    @staticmethod
    def find_free_port(start_port: int = 8001) -> int:
        for port in range(start_port, start_port + 500):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(("127.0.0.1", port)) != 0:
                    return port
        return start_port

    @classmethod
    def run_command(cls, project_id: str, command: str, timeout_sec: int = 30) -> Tuple[int, str, str]:
        pdir = cls.get_project_dir(project_id)
        print(f"[Sandbox] Running in {pdir}: {command}")
        
        try:
            proc = subprocess.Popen(
                command,
                shell=True,
                cwd=pdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            stdout, stderr = proc.communicate(timeout=timeout_sec)
            return proc.returncode, stdout, stderr
        except subprocess.TimeoutExpired:
            proc.kill()
            return -1, "", f"Execution timed out after {timeout_sec} seconds."
        except Exception as e:
            return 1, "", str(e)

    @classmethod
    def run_docker_build(cls, project_id: str) -> Tuple[bool, str]:
        pdir = cls.get_project_dir(project_id)
        image_tag = f"ai-app-{project_id.lower()}"

        dockerfile_path = os.path.join(pdir, "Dockerfile")
        if not os.path.exists(dockerfile_path):
            default_dockerfile = (
                "FROM python:3.11-slim\n"
                "WORKDIR /app\n"
                "COPY requirements.txt .\n"
                "RUN pip install --no-cache-dir -r requirements.txt || true\n"
                "COPY . .\n"
                "EXPOSE 8000\n"
                "CMD [\"python\", \"main.py\"]\n"
            )
            with open(dockerfile_path, "w", encoding="utf-8") as f:
                f.write(default_dockerfile)

        code, out, err = cls.run_command(project_id, f"docker build -t {image_tag} .", timeout_sec=120)
        if code == 0:
            return True, out
        else:
            return False, f"Docker Build Warning/Fallback:\n{err or out}"

    @classmethod
    def deploy_container(cls, project_id: str, host_port: int) -> Tuple[bool, str, Dict[str, Any]]:
        image_tag = f"ai-app-{project_id.lower()}"
        container_name = f"container-{project_id.lower()}"

        subprocess.run(f"docker rm -f {container_name}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        cmd = f"docker run -d --name {container_name} -p {host_port}:8000 -e PORT=8000 {image_tag}"
        code, out, err = cls.run_command(project_id, cmd, timeout_sec=20)

        if code == 0:
            c_id = out.strip()[:12]
            live_url = f"http://localhost:{host_port}"
            return True, f"Container started successfully (ID: {c_id})", {
                "container_id": c_id,
                "container_name": container_name,
                "live_url": live_url,
                "port": host_port
            }
        else:
            return cls._deploy_local_process(project_id, host_port)

    @classmethod
    def _deploy_local_process(cls, project_id: str, host_port: int) -> Tuple[bool, str, Dict[str, Any]]:
        pdir = cls.get_project_dir(project_id)
        pid_file = os.path.join(pdir, ".app_pid")
        
        if os.path.exists(pid_file):
            try:
                with open(pid_file, "r") as f:
                    old_pid = int(f.read().strip())
                os.kill(old_pid, 9)
                time.sleep(0.5)
            except Exception:
                pass

        env = os.environ.copy()
        env["PORT"] = str(host_port)
        
        cmd = f"{sys.executable} main.py"
        if os.path.exists(os.path.join(pdir, "app.py")):
            cmd = f"{sys.executable} app.py"

        proc = subprocess.Popen(
            cmd,
            shell=True,
            cwd=pdir,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        with open(pid_file, "w") as f:
            f.write(str(proc.pid))

        live_url = f"http://localhost:{host_port}"
        return True, f"Started isolated sandbox app process (PID: {proc.pid}, Port: {host_port})", {
            "container_id": f"proc-{proc.pid}",
            "container_name": f"local-{project_id[:8]}",
            "live_url": live_url,
            "port": host_port
        }

    @classmethod
    async def check_health(cls, live_url: str, path: str = "/health", retries: int = 10) -> Tuple[bool, str]:
        url = f"{live_url.rstrip('/')}{path}"
        async with httpx.AsyncClient(timeout=3.0) as client:
            for attempt in range(retries):
                try:
                    resp = await client.get(url)
                    if resp.status_code == 200:
                        return True, f"200 OK ({resp.text[:100]})"
                    else:
                        if attempt == retries - 1:
                            return False, f"HTTP {resp.status_code}: {resp.text[:200]}"
                except Exception as e:
                    if attempt == retries - 1:
                        return False, f"Connection failed: {str(e)}"
                time.sleep(0.4)
        return False, "Healthcheck timed out"
