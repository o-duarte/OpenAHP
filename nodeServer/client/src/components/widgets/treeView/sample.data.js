var treeData = {
  name: 'Best Car',
  showChildren: true,
  editMode: false,
  children: [
    {
      name: 'Cost',
      showChildren: false,
      editMode: false,
      children: []
    },
    {
      name: 'Maintenance',
      showChildren: false,
      editMode: false,
      children: [
        {
          name: 'insurance',
          showChildren: false,
          editMode: false,
          children: []
        },
        {
          name: 'warranty',
          showChildren: true,
          editMode: false,
          children: []
        },
        {
          name: 'fuel',
          showChildren: true,
          editMode: false,
          children: []
        },        
      ]
    },
    {
      name: 'prestige',
      showChildren: false,
      editMode: false,
      children: []
    },
    {
      name: 'quality',
      showChildren: false,
      editMode: false,
      children: [
        {
          name: 'safety',
          showChildren: false,
          editMode: false,
          children: []
        },
        {
          name: 'breakdown',
          showChildren: false,
          editMode: false,
          children: []
        },
        {
          name: 'performance',
          showChildren: false,
          editMode: false,
          children: []
        },
        {
          name: 'desing',
          showChildren: false,
          editMode: false,
          children: [
            {
              name: 'exterior',
              showChildren: false,
              editMode: false,
              children: []
            },
            {
              name: 'interior',
              showChildren: false,
              editMode: false,
              children: []
            }
          ]
        },
        {
          name: 'driving',
          showChildren: false,
          editMode: false,
          children: []
        }
      ]
    },

  ]
}

export default treeData;