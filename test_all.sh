#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Running all tests..."
echo

# Frontend Tests
echo "=== Frontend Tests ==="
cd frontend
npm run test:ci
FRONTEND_RESULT=$?
echo

# Backend Tests
echo "=== Backend Tests ==="
cd ../backend
python -m pytest
BACKEND_RESULT=$?
echo

# Print summary
echo "=== Test Summary ==="
if [ $FRONTEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}"
else
    echo -e "${RED}✗ Frontend tests failed${NC}"
fi

if [ $BACKEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "${RED}✗ Backend tests failed${NC}"
fi

# Exit with error if any tests failed
if [ $FRONTEND_RESULT -ne 0 ] || [ $BACKEND_RESULT -ne 0 ]; then
    exit 1
fi
