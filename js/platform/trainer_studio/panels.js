var panels = {
  "basic-info": {
    title: "Basic Information",
    features: [
      {
        type: "variable",
        code: "t.firstName",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "variable",
        code: "t.lastName",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "variable",
        code: "t.favoriteElement",
        hasReturnValue: true,
        displayType: "table"
      }
    ]
  },
  "current-state": {
    title: "Current State",
    features: [
      {
        type: "variable",
        code: "t.energy",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        code: "t.happiness",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        code: "t.confidence",
        hasReturnValue: true,
        displayType: "bar"
      }
    ]
  },
  "name": {
    title: "Name",
    features: [
      {
        type: "method",
        code: "t.getFullName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        code: "t.getReverseName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        code: "t.getDoubleFullName()",
        hasReturnValue: true,
        displayType: "table"
      }
    ]
  },
}