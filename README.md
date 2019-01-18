# IMATTC
A Greasemonkey-powered total overhaul for the Ingress Mission Authoring Tool

## Features
- Total overhaul of the main mission listing, featuring:
  - Better use of screen space
  - More distinct colouration and iconography for mission status
  - Consistent mission ordering (missions are always sorted by mission name)
- Minor UI enhancements to mission creation/editing

## Upcoming features
- User-created categories for missions.
- Drag-and-drop waypoint reordering in Waypoint view
- Extra options for filtering/searching missions

## Known issues
- Transition issues on main mission page - when performing mission actions, previous layout can be seen for fraction of a second.
- Disclaimer about Any Order missions on Mision Type page should only appear when Any Order is selected, but curretly also appears on page load regardless of mission type.
- Is there better icon to use for Sequential missions?

## Release History
- 0.3.4: Preparation for beta testing. Page changes now check variable for page load to confirm page transition. Adding better breadcrumb to Edit Mission pages. Added warning about Any Order missions when selected as Mission Type. Better handing for mission images. CSS fixes. 
- pre-0.3.4: To be written - for now, check commits on Github.