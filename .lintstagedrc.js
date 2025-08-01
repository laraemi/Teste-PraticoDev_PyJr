module.exports = {
    'backend/**/*.py': [
        'black --check',
        'flake8',
        'python -m pytest tests/ --tb=short'
    ],
    'frontend/src/**/*.{js,jsx,ts,tsx}': [
        'eslint --fix',
        'npm test -- --run --findRelatedTests'
    ],
    'frontend/src/**/*.{css,scss}': [
        'stylelint --fix'
    ]
} 