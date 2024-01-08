export default defineEventHandler(async () => {
  if (!process.env.NOTION_SECRET) {
    throw new Error("NOTION_SECRET is not defined");
  }
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_SECRET}`,
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        and: [
          {
            property: "Project Category",
            rollup: {
              any: {
                select: {
                  equals: "Chain",
                },
              },
            },
          },
          {
            property: "Status",
            status: {
              equals: "Done",
            },
          },
        ],
      },
      sorts: [
        {
          property: "Start Date",
          direction: "descending",
        },
      ],
      page_size: 100,
    }),
  };

  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
    options
  ).then((response) => response.json());

  const { results } = response;
  const formattedResults = results.map((result: any) => {
    const { properties } = result;
    return {
      title: properties["Task name"].title[0].plain_text,
      project: properties["Project Title"].rollup?.array[0].title[0].plain_text,
      priority: properties["Task Priority"].select?.name || "Low",
      assignees: !properties["Assignee Names"]
        ? []
        : properties["Assignee Names"].formula.string
            .split(",")
            .map((name: string) => name.trim()),
      startDate: properties["Start Date"]?.date.start,
      endDate: properties["End Date"]?.date.start,
      mandays: properties["Man-days"].formula.number,
    };
  });
  return {
    results: formattedResults,
  };
});
