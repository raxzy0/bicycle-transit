#!/bin/bash

echo "========================================="
echo "Bicycle Transit Extension Validation"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
    else
        echo -e "${RED}✗${NC} $1 is missing"
        ((ERRORS++))
    fi
}

# Function to validate JSON
validate_json() {
    if python3 -m json.tool "$1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $1 is valid JSON"
    else
        echo -e "${RED}✗${NC} $1 has JSON errors"
        ((ERRORS++))
    fi
}

# Function to check JavaScript syntax
check_js_syntax() {
    if node --check "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 syntax is valid"
    else
        echo -e "${RED}✗${NC} $1 has syntax errors"
        ((ERRORS++))
    fi
}

# Check required files
echo "Checking Required Files:"
echo "------------------------"
check_file "manifest.json"
check_file "popup.html"
check_file "popup.css"
check_file "popup.js"
check_file "content.js"
check_file "background.js"
check_file "styles.css"
check_file "icons/icon16.png"
check_file "icons/icon48.png"
check_file "icons/icon128.png"
echo ""

# Check documentation files
echo "Checking Documentation:"
echo "-----------------------"
check_file "README.md"
check_file "LICENSE"
check_file "INSTALL.md"
check_file "TESTING.md"
check_file "ARCHITECTURE.md"
check_file "CONTRIBUTING.md"
echo ""

# Validate JSON files
echo "Validating JSON:"
echo "----------------"
validate_json "manifest.json"
echo ""

# Check JavaScript syntax
echo "Checking JavaScript Syntax:"
echo "---------------------------"
check_js_syntax "popup.js"
check_js_syntax "content.js"
check_js_syntax "background.js"
echo ""

# Check manifest version
echo "Checking Manifest Version:"
echo "--------------------------"
VERSION=$(python3 -c "import json; print(json.load(open('manifest.json'))['manifest_version'])" 2>/dev/null)
if [ "$VERSION" = "3" ]; then
    echo -e "${GREEN}✓${NC} Using Manifest V3"
else
    echo -e "${RED}✗${NC} Not using Manifest V3 (found: $VERSION)"
    ((ERRORS++))
fi
echo ""

# Check required permissions
echo "Checking Permissions:"
echo "---------------------"
PERMS=$(python3 -c "import json; print(' '.join(json.load(open('manifest.json'))['permissions']))" 2>/dev/null)
if [[ $PERMS == *"storage"* ]]; then
    echo -e "${GREEN}✓${NC} Has storage permission"
else
    echo -e "${RED}✗${NC} Missing storage permission"
    ((ERRORS++))
fi
echo ""

# Check icon sizes
echo "Checking Icon Sizes:"
echo "--------------------"
for size in 16 48 128; do
    if [ -f "icons/icon${size}.png" ]; then
        FILE_SIZE=$(stat -f%z "icons/icon${size}.png" 2>/dev/null || stat -c%s "icons/icon${size}.png" 2>/dev/null)
        if [ "$FILE_SIZE" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} icon${size}.png exists and has content ($FILE_SIZE bytes)"
        else
            echo -e "${RED}✗${NC} icon${size}.png is empty"
            ((ERRORS++))
        fi
    fi
done
echo ""

# File size check
echo "Extension Size:"
echo "---------------"
TOTAL_SIZE=$(du -sh . | cut -f1)
echo "Total size: $TOTAL_SIZE"
echo ""

# Summary
echo "========================================="
echo "Validation Summary"
echo "========================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "${GREEN}✓ Extension is ready to load${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warnings${NC}"
    echo -e "${GREEN}✓ Extension should work${NC}"
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS errors${NC}"
    [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}⚠ Found $WARNINGS warnings${NC}"
    echo -e "${RED}✗ Please fix errors before loading${NC}"
    exit 1
fi
