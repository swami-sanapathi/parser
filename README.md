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


simple arithmetic expression and query language expression
```
1+1
1+11+11111+22*2/2
on identifier aggregate count(identifier)
on identifier validUntil Instant filterBy(identifier) aggregate count(identifier)
```

now i want to extend the grammar to support query language expression followed by arithmetic expression and another one is arithmetic expression followed by query language expression.

for example:
query language expression followed by arithmetic expression:
```
on identifier aggregate count(identifier) + 10 + 10 * 1 * 15 / 44
on identifier validUntil Instant aggregate count(identifier) * 5
on identifier filterBy(identifier) aggregate count(identifier) / 5
on identifier validUntil Instant filterBy(identifier) aggregate count(identifier) - 4
```


arithmetic expression followed by query language expression:
```
5 + on identifier aggregate count(identifier)
5 * 5 + on identifier validUntil Instant aggregate count(identifier)
5 / 5 + on identifier filterBy(identifier) aggregate count(identifier)
5 - 4 + on identifier validUntil Instant filterBy(identifier) aggregate count(identifier)
``` 

please correct the parser accordingly, and query language should present only once
