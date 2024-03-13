## Important Headers
- X-FRAME-OPTIONS: 'SAMEORIGIN'
- X-Content-Type-Options: 'nosniff'
- X-XSS-Protection: '1; mode=block'
- Content-Security-Policy

































- on Employee filterBy(isActiveEmployee) aggregate count(Employee.EmployeeID)

### Supported Keywords
    - on
    - validUntil
    - instant
    - filterBy
    - aggregate
    - count

### TODO:
    - Add Subject, Property, concept validations
    - Query transformation
    - Unit tests on lexer, parser, visitor and query transformation
    - Custom Errors for lexer, parser, Subject, Property, concept validations
    - Integrate remaining keywords 

### Basic
    - default analytic dashboards & widgets
    - formulas for each widget
    - define objects and functions, keywords for 1st phase
