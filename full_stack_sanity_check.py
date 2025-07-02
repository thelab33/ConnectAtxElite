import os
import re
import subprocess

PROJECT_ROOT = os.path.abspath('.')
TEMPLATES_DIR = os.path.join(PROJECT_ROOT, 'app', 'templates')
STATIC_DIR = os.path.join(PROJECT_ROOT, 'app', 'static')

# Add your critical files here:
EXPECTED_FILES = {
    'templates': [
        'base.html',
        'index.html',
        'partials/header.html',
        'partials/footer.html',
        'partials/goal_hud.html',
        # Add more as needed
    ],
    'static_css': [
        'tailwind.min.css',
        'css/partials/header.css',
        'css/partials/hero.css',
        # Add more as needed
    ],
    'static_js': [
        'js/bundle.min.js',
        # Add more as needed
    ],
    'static_images': [
        'logo.png',
        'connect-atx-team.jpg',
        # Add more as needed
    ],
}

def check_files(file_list, base_dir):
    missing = []
    for f in file_list:
        path = os.path.join(base_dir, f)
        if not os.path.exists(path):
            missing.append(f)
    return missing

def run_linter(command, label):
    print(f'\nRunning {label}...')
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode != 0 or result.stdout.strip():
            print(f'--- {label} issues ---')
            print(result.stdout.strip())
        else:
            print(f'{label} passed with no issues.')
    except Exception as e:
        print(f'Error running {label}: {e}')

def find_static_refs_in_templates():
    """Parse templates for static asset URLs from url_for('static', filename='...')"""
    pattern = re.compile(r"url_for\('static',\s*filename\s*=\s*'([^']+)'\)")
    refs = set()
    for root, _, files in os.walk(TEMPLATES_DIR):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    matches = pattern.findall(content)
                    for m in matches:
                        refs.add(m)
    return refs

def check_static_assets(references):
    missing = []
    for ref in references:
        path = os.path.join(STATIC_DIR, ref.replace('/', os.sep))
        if not os.path.exists(path):
            missing.append(ref)
    return missing

def check_env_vars(vars_list):
    missing = []
    for var in vars_list:
        if not os.getenv(var):
            missing.append(var)
    return missing

def main():
    print('=== Connect ATX Elite Full Stack Sanity Check ===\n')

    # Check critical files presence
    for category, files in EXPECTED_FILES.items():
        base = TEMPLATES_DIR if 'templates' in category else STATIC_DIR
        missing = check_files(files, base)
        if missing:
            print(f'Missing {category} files:')
            for f in missing:
                print(f'  - {f}')
        else:
            print(f'All {category} files present.')

    # Run linters
    run_linter('stylelint "app/static/css/**/*.css"', 'CSS Lint')
    run_linter('htmlhint "app/templates/**/*.html"', 'HTML Lint')
    run_linter('eslint "app/static/js/**/*.js"', 'JS Lint')

    # Check environment variables
    required_env_vars = ['FLASK_APP', 'FLASK_ENV', 'SECRET_KEY', 'DATABASE_URL']
    missing_env = check_env_vars(required_env_vars)
    if missing_env:
        print('\nMissing environment variables:')
        for v in missing_env:
            print(f'  - {v}')
    else:
        print('\nAll required environment variables set.')

    # Check .env presence
    if not os.path.exists('.env'):
        print('\nWarning: .env file not found.')

    # Check static assets referenced in templates
    refs = find_static_refs_in_templates()
    missing_assets = check_static_assets(refs)
    if missing_assets:
        print('\nMissing static assets referenced in templates:')
        for a in missing_assets:
            print(f'  - {a}')
    else:
        print('\nAll static assets referenced in templates are present.')

    print('\n=== Sanity check complete ===')

if __name__ == '__main__':
    main()
