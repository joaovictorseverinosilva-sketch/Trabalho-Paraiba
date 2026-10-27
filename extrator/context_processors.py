import os
import subprocess
from datetime import datetime

_LATEST_FALLBACK_COMMIT = 'afdd4a0'
_REPO_URL = 'https://github.com/joaovictorseverinosilva-sketch/Trabalho-Paraiba'

def get_git_commit_info():
    commit = None
    date_str = None
    
    # 1. Check environment variables (Render sets RENDER_GIT_COMMIT)
    render_commit = os.environ.get('RENDER_GIT_COMMIT') or os.environ.get('GIT_COMMIT') or os.environ.get('COMMIT_HASH')
    if render_commit:
        commit = render_commit.strip()[:7]
    
    # 2. Try git CLI if in git repo
    if not commit:
        try:
            commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], stderr=subprocess.DEVNULL).decode('utf-8').strip()
        except Exception:
            pass

    # 3. Try reading from latest_commit.txt if exists
    if not commit:
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            commit_file = os.path.join(base_dir, 'latest_commit.txt')
            if os.path.exists(commit_file):
                with open(commit_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        commit = content[:7]
        except Exception:
            pass

    if not commit:
        commit = _LATEST_FALLBACK_COMMIT

    # Commit date
    try:
        date_str = subprocess.check_output(
            ['git', 'log', '-1', '--format=%cd', '--date=format:%d/%m/%Y %H:%M'],
            stderr=subprocess.DEVNULL
        ).decode('utf-8').strip()
    except Exception:
        pass

    if not date_str:
        date_str = datetime.now().strftime('%d/%m/%Y %H:%M')

    commit_url = f"{_REPO_URL}/commit/{commit}"

    return {
        'commit': commit,
        'date': date_str,
        'repo_url': _REPO_URL,
        'commit_url': commit_url,
    }

def git_info(request):
    return {
        'git_info': get_git_commit_info()
    }
