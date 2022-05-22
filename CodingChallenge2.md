# Coding Challenge 2
## Scenario
Now, users have realized that every company is different. They each care about different employee information. For example, one company might care about "number of trips to Canada" for each employee while another only cares about "vacation days" for each employee.

This will be tricky with the current data structure because each employee field (name, avatar, title, country) are each a separate column. If company A wants to store "hire date" and company B only cares about "birth date", that would eventually lead to a lot of different columns that are mostly empty.

How can we tie these "metadata" columns to a specific company and the "metadata" values to a specific employee? There has to be a better way to make custom employee fields on a company basis.

## Already Built
- [x] Coding Challenge 1 should already be complete. If you haven't already completed it, you will have to do that as part of this coding challenge.

## Requirements
- [ ] Somewhere of your choosing in the UI, a user should be able to add a new custom employee field for a particular company.
  - NOTE: You do not need to support multiple data types for this task. The values can be entered, stored, and displayed as text.
- [ ] Somewhere of your choosing in the UI, a user should be able to populate the values for the fields for a given employee in that company.
- [ ] Display any new custom employee field next to each employee on the single company page.

### Design
- UI does not need to be a work of art, but we expect any new UI to follow a similar design style to what already exists.
- UX will be evaluated. Specifically, we want to see if added elements are easy to use and make sense where they are placed.

## Getting Started
Refer to `README.md` to get the app up and running