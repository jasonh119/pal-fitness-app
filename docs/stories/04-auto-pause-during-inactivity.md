# User Story: 4 - Auto-Pause During Inactivity

**As a** walker or runner,
**I want** the app to automatically pause tracking when I stop moving,
**so that** my distance and time measurements are accurate without manual intervention.

## Acceptance Criteria

* App detects when user has stopped moving for a certain period
* Tracking automatically pauses during inactivity
* Tracking resumes when movement is detected again
* Pause/resume events are clearly indicated to the user
* Accurate distance is captured excluding stationary time

## Notes

* Should prevent distance from ticking when user is not actually moving
* Auto-pause sensitivity should be configurable