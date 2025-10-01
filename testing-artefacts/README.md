# Testing Artefacts

This directory contains all testing documentation, reports, and screenshots for the PAL Fitness App.

## Directory Structure

```
testing-artefacts/
├── README.md                              # This file
├── playwright-test-summary-2025-10-01.md  # Playwright MCP test report
└── screenshots/                           # Test screenshots
    ├── gps-tracking-page.png
    ├── route-detail-page.png
    ├── target-detail-page.png
    └── targets-with-new-target.png
```

## Test Reports

### Playwright MCP Testing (October 1, 2025)

- **Report:** `playwright-test-summary-2025-10-01.md`
- **Coverage:** GPS Tracking, Routes Management, Fitness Targets
- **Status:** All tests passed ✅
- **User Stories Tested:**
  - Story 02: Track GPS Data and Routes
  - Story 05: Set and Track Fitness Targets

## Screenshots

All screenshots are stored in the `screenshots/` directory and are referenced in the test reports.

### Current Screenshots

1. **gps-tracking-page.png** - GPS tracking interface with map and controls
2. **route-detail-page.png** - Individual route view with full map visualization
3. **target-detail-page.png** - Fitness target details with progress chart
4. **targets-with-new-target.png** - Targets dashboard with all active targets

## Adding New Test Reports

When adding new test reports, follow this naming convention:

```
[test-tool]-test-summary-YYYY-MM-DD.md
```

Examples:
- `playwright-test-summary-2025-10-01.md`
- `jest-unit-test-summary-2025-10-05.md`
- `cypress-e2e-test-summary-2025-10-10.md`

## Guidelines

1. **Screenshots:** Save all screenshots in the `screenshots/` subdirectory
2. **Naming:** Use descriptive names for screenshots (e.g., `feature-name-page.png`)
3. **References:** Always reference screenshots in your test reports using relative paths
4. **Timestamps:** Include date and time in all test reports
5. **User Stories:** Link test reports to the relevant user stories in `/docs/stories/`
6. **Status:** Clearly mark test results as PASSED ✅, FAILED ❌, or SKIPPED ⏭️

## Test History

| Date | Test Type | Tool | Stories Tested | Status | Report |
|------|-----------|------|----------------|--------|--------|
| 2025-10-01 | E2E | Playwright MCP | 02, 05 | ✅ PASSED | [View Report](playwright-test-summary-2025-10-01.md) |

---

Last Updated: October 1, 2025
