import subprocess
import os
import time

def run():
    env = os.environ.copy()
    env["TWENTYFIRST_API_KEY"] = "21st_sk_7953797d6af4889f13a0952385d882e47b925be424ae472f70413bed8d21aaf1"
    env["PATH"] = env.get("PATH", "") + ":/usr/local/bin"
    
    # Start without piping to see stdout directly in logs or run with a short timeout
    proc = subprocess.Popen(
        ["/usr/local/bin/npx", "-y", "@21st-dev/magic@latest"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=env
    )
    
    time.sleep(3) # Wait for startup/install
    print("Sending list request...")
    proc.stdin.write('{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1}\n')
    proc.stdin.flush()
    
    time.sleep(2)
    # Read whatever is available
    import select
    ready_to_read, _, _ = select.select([proc.stdout], [], [], 2)
    if ready_to_read:
        line = proc.stdout.readline()
        print("STDOUT:", line)
    else:
        print("No stdout data available")
        
    proc.stdin.close()
    print("STDERR:", proc.stderr.read())
    proc.wait()

if __name__ == "__main__":
    run()
