# === ELITE FLASK PROJECT AUDIT: CLI EDITION ==================================
echo "==================[ 1. PYTHON + VENV STATUS ]=================="
which python3; python3 --version
echo; which pip; pip --version
echo; echo "Venv:"; echo $VIRTUAL_ENV

echo; echo "==================[ 2. FLASK APP ENTRYPOINT ]=================="
grep -E 'Flask\(' app/__init__.py
grep -E 'def create_app' app/__init__.py
cat run.py | head -20

echo; echo "==================[ 3. FILETREE & STRUCTURE ]=================="
tree -L 3 | tee .audit.tree.txt

echo; echo "==================[ 4. BLUEPRINT & ROUTE IMPORTS ]=================="
grep -ER 'Blueprint|register_blueprint' app/routes/*.py app/__init__.py

echo; echo "==================[ 5. CONFIG & ENV CHECKS ]=================="
cat app/config.py 2>/dev/null || echo "No app/config.py"
ls -lh .env* || echo "No .env file"
grep -iE 'SECRET|KEY|DATABASE|URL' app/__init__.py

echo; echo "==================[ 6. STATIC & TEMPLATES ]=================="
ls -lh app/static | head -10
ls -lh app/templates | head -10
find app/static -type f | wc -l | xargs echo "Static files:"
find app/templates -type f | wc -l | xargs echo "Template files:"

echo; echo "==================[ 7. JS/CSS BUNDLE STATUS ]=================="
ls -lh app/static/js/bundle.min.js 2>/dev/null || echo "No bundle.min.js"
ls -lh app/static/tailwind.min.css 2>/dev/null || echo "No tailwind.min.css"

echo; echo "==================[ 8. LINT ALL PYTHON ]=================="
find . -type f -name "*.py" | xargs pylint --disable=R,C,W1203 || echo "pylint issues (see above)"

echo; echo "==================[ 9. GREP FOR TODO/FIXME/HACK/XXX ]=================="
grep -rnw . -e 'TODO\|FIXME\|HACK\|XXX' || echo "No TODO/FIXME found!"

echo; echo "==================[ 10. DATABASE MIGRATIONS ]=================="
ls -lh migrations/ 2>/dev/null || echo "No migrations folder"
alembic current 2>/dev/null || echo "No alembic status (is Flask-Migrate/Alembic set up?)"

echo; echo "==================[ 11. REQUIREMENTS CHECK ]=================="
cat requirements.txt 2>/dev/null || echo "No requirements.txt"
pip freeze | tee .audit.pipfreeze.txt | head -20

echo; echo "==================[ 12. TEST DISCOVERY (if present) ]=================="
pytest --maxfail=3 --disable-warnings || echo "pytest not found or no tests."

echo; echo "==================[ 13. GIT STATUS ]=================="
git status -sb
git log --oneline --decorate -n 5

echo; echo "==================[ 14. COMMON SECURITY SCANS ]=================="
pip install --quiet bandit safety
bandit -r app/ | tee .audit.bandit.txt
safety check | tee .audit.safety.txt

echo; echo "==================[ 15. DOCKER/PACKAGING CHECK ]=================="
ls -l Dockerfile* 2>/dev/null || echo "No Dockerfile"
cat Dockerfile 2>/dev/null | head -20

echo; echo "==================[ 16. OPEN PORTS (for dev env only) ]=================="
ss -tulpn | grep 5000 || netstat -tulpn | grep 5000 || echo "Flask not listening on 5000?"

echo; echo "==================[ 17. FINAL SUMMARY ]=================="
echo "Check .audit.tree.txt, .audit.pipfreeze.txt, .audit.bandit.txt, .audit.safety.txt for full results."
echo "If you see 'No issues found' and your server runs clean: You’re GOLDEN! 🌟"
echo "========================================================================="
