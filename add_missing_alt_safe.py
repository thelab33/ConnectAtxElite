import os
import subprocess

PROJECT_ROOT = os.path.abspath('.')
TEMPLATES_DIR = os.path.join(PROJECT_ROOT, 'app', 'templates')
STATIC_DIR = os.path.join(PROJECT_ROOT, 'app', 'static')

EXPECTED_FILES = {
    'templates': [
        'base.html',
        'index.html',
        'partials/header.html',
        'partials/footer.html',
        # Add other critical templates
    ],
    'static_css': [
        'tailwind.min.css',
        'css/partials/header.css',
        # Add other key CSS files
    ],
    'static_js': [
        'js/bundle.min.js',
        # Add other JS files
    ],
    'static_images': [
        'logo.png',
        'connect-atx-team.jpg',
        # Add other critical images
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
    print(f'Running {label}...')
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode != 0:
            print(f'--- {label} issues ---')
            print(result.stdout)
        else:
            print(f'{label} passed with no issues.')
    except Exception as e:
        print(f'Error running {label}: {e}')

def main():
    print('Checking critical files...')
    for category, files in EXPECTED_FILES.items():
        base = TEMPLATES_DIR if 'templates' in category else STATIC_DIR
        missing = check_files(files, base)
        if missing:
            print(f'Missing {category} files:')
            for f in missing:
                print(f'  - {f}')
        else:
            print(f'All {category} files present.')

    print('\nLinting CSS...')
    run_linter('stylelint "app/static/css/**/*.css"', 'CSS Lint')

    print('\nLinting HTML...')
    run_linter('htmlhint "app/templates/**/*.html"', 'HTML Lint')

    print('\nLinting JS...')
    run_linter('eslint "app/static/js/**/*.js"', 'JS Lint')

    print('\nEnvironment check...')
    # Example: Check FLASK_APP env var or .env presence
    flask_app = os.getenv('FLASK_APP')
    if not flask_app:
        print('Warning: FLASK_APP environment variable is not set.')
    else:
        print(f'FLASK_APP is set to {flask_app}')
    if not os.path.exists('.env'):
        print('Warning: .env file is missing.')

    print('\nStatic assets referenced in templates:')
    # TODO: You can add logic here to parse templates for static references and check file existence

    print('\nFull stack sanity check complete.')

if __name__ == '__main__':
    main()
