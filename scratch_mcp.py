import subprocess
import json
import os
import sys

def test_mcp():
    env = os.environ.copy()
    env["TWENTYFIRST_API_KEY"] = "21st_sk_7953797d6af4889f13a0952385d882e47b925be424ae472f70413bed8d21aaf1"
    env["PATH"] = env.get("PATH", "") + ":/usr/local/bin"
    
    # Start the MCP server process
    proc = subprocess.Popen(
        ["/usr/local/bin/npx", "-y", "@21st-dev/magic@latest"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=env
    )
    
    # List tools request
    req = {
        "jsonrpc": "2.0",
        "method": "tools/list",
        "params": {},
        "id": 1
    }
    
    # Send request
    proc.stdin.write(json.dumps(req) + "\n")
    proc.stdin.flush()
    
    # Read response
    line = proc.stdout.readline()
    print("STDOUT:", line)
    
    # Close stdin to allow the process to terminate
    proc.stdin.close()
    
    # If there's stderr
    errs = proc.stderr.read()
    if errs:
        print("STDERR:", errs)
        
    proc.wait()

if __name__ == "__main__":
    test_mcp()
