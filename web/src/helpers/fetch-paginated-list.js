export const fetchPaginatedList = async (
  service,
  path,
  query = null,
  key = null
) => {
  let pageInfo;
  let hasNext = true;
  let allList = [];
  let dynamicPath = key ?? path;

  while (hasNext) {
    let url = `/${path}.json?limit=250`;
    if (query) url = `${url}&${query}`;
    if (pageInfo) url = `${url}&page_info=${pageInfo}`;

    try {
      const resp = await service.get(url);
      const lists = resp.data[dynamicPath];
      allList = [...allList, ...lists];
      const { nextPageInfo } = parseHeaderLink(resp.headers.link);

      if (nextPageInfo) {
        pageInfo = nextPageInfo.replace(">;", "");
      } else {
        pageInfo = false;
        hasNext = false;
      }
    } catch (error) {
      console.log("*********************************************************");
      console.log(service.shop_name, path);
      console.log(error);
      console.log("Paginated Error", error?.response?.data ?? error.toString());
      console.log("*********************************************************");

      return {
        [dynamicPath]: allList,
      };
    }
  }

  return {
    [dynamicPath]: allList,
  };
};

export async function paginationWithCallback(
  { path, query = null, service, limit = 250 },
  cb
) {
  return new Promise(async (resolve, reject) => {
    let hasNext = true;
    let pageInfo = null;

    while (hasNext) {
      let url = path + `?limit=${limit}`;
      if (query) url = `${url}&${query}`;
      if (pageInfo)
        url = `${url}&page_info=${pageInfo}`.replace(
          "&query=email_marketing_state:subscribed",
          ""
        );

      const resp = await service.get(url);
      const { nextPageInfo } = parseHeaderLink(resp.headers.link);
      const data = resp.data;

      if (nextPageInfo) {
        pageInfo = nextPageInfo.replace(">;", "");
      } else {
        pageInfo = null;
        hasNext = false;
      }

      await cb(data);
    }

    resolve();
  });
}

const parseHeaderLink = (link) => {
  let nextPageInfo;
  let previousPageInfo;

  if (link) {
    const parentArr = link.split(" ");
    const extractLink = (str) => {
      str = str.replace("<", "").replace(">;", "");
      const queryPart = str.split("?")[1];
      const queries = queryPart.split("&");
      const idx = queries.findIndex((q) => q.includes("page_info"));
      const pageInfo = queries[idx].split("=")[1];
      return pageInfo;
    };
    if (parentArr.length > 2) {
      previousPageInfo = extractLink(parentArr[0]);
      nextPageInfo = extractLink(parentArr[2]);
    } else {
      if (link.includes("next")) {
        nextPageInfo = extractLink(parentArr[0]);
      }
    }
  }

  return {
    nextPageInfo,
    previousPageInfo,
  };
};
