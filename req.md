## Issue sheet App

### Drawing register schema

- projectNumber
- projectDescipline
- projectEngineers [array of uses]
- commencementDate
- completionDate
- categories [array of categories]

  #### Category

  - title
  - description
  - drawings [array of drawings]

  #### Drawing

  - drawingNumber(dwg Number)
  - description
  - title
  - size
  - drawing title
  - Revision [ array of the all drawing revisions]

### Issue sheet Schema

- issueSheetNumber (auto increment, according to format)
- to
- attention
- client
- project name
- projectNumber
- date
- DrawingsIssued [array of drawing to be issued, this is in the drawing register]
- remarks
- issued for
- media
- issuedBy {name, signature, date}
- receivedBy {name, signature, date}

  #### DrawingsIssued

  - dwgNumber
  - drawing title
  - copies
  - size
  - revisionMark
