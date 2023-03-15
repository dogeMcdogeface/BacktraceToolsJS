

nodeStructure = {
  text: { name: "Parent node" },
  children: [
    {
      text: {
        name: "First child",
        title: "TITLE",
        desc: "DESC",
      },
    },
    {
      text: { name: "Second child" },
    },
    {
      text: { name: "Second child" },
      children: [
          {
            text: {
              name: "First child",
              title: "TITLE",
              desc: "DESC",
            },
          },
          {
            text: { name: "Second child" },
          },
          {
            text: { name: "Second child" },
          },
        ],
    },
  ],
};


chart2 = {
  container: "#tree-simple2",
  rootOrientation: "NORTH",
};

nodeStructure2 = {
  text: { name: "Parent node" },
  children: [
    {
      text: {
        name: "First child",
        title: "TITLE",
        desc: "DESC",
      },
    },
  ],
};




var my_chart = new Treant({ chart: chart2, nodeStructure: nodeStructure2 });
