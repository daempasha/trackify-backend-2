import express, { Request, Response } from "express";
import eBayApi from "ebay-api";
import { MarketplaceId, SiteId } from "ebay-api/lib/enums";
import { AppConfig } from "ebay-api/lib/types";

const router = express.Router();

const generateEbayApiConfig = (): AppConfig => {
  return {
    ruName: "mohammad_bilaal-mohammad-Tracki-eqpoahev",
    appId: process.env.EBAY_APP_ID || "",
    certId: process.env.EBAY_CLIENT_SECRET || "",
    sandbox: false,
    siteId: SiteId.EBAY_GB,
    marketplaceId: MarketplaceId.EBAY_GB,
  };
};

interface CategoriesBody {
  DetailLevel: string;
  LevelLimit: string;
  ViewAllNodes: boolean;
  CategoryParent?: string;
}

router.get("/v1/auth/token", async (req: Request, res: Response) => {
  const code = req.query.code as string; // this is provided from eBay
  const eBay = new eBayApi({
    ...generateEbayApiConfig(),
  });

  try {
    const token = await eBay.OAuth2.getToken(code);
    eBay.OAuth2.setCredentials(token);
    req.session.token = token;
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

router.get("/construct-url", async (req: Request, res: Response) => {
  const ebayApiConfig = generateEbayApiConfig();
  const eBay = new eBayApi({
    ...ebayApiConfig,
  });

  const url = eBay.OAuth2.generateAuthUrl();
  console.log("url: ", url);
  res.send({ url: url });
});

router.get("/suggest-category", async (req: Request, res: Response) => {
  const accessToken = req.headers["x-ebay-access-token"];
  const ebayApiConfig = generateEbayApiConfig();

  const query = req.query.q;
  const eBay = new eBayApi({
    ...ebayApiConfig,
    authToken: accessToken as string,
  });

  const response = await eBay.trading.GetSuggestedCategories({
    Query: query as string,
  });

  res.json(response);
});

router.get("/categories", async (req: Request, res: Response) => {
  const accessToken = req.headers["x-ebay-access-token"];
  const ebayApiConfig = generateEbayApiConfig();

  const level = req.query.level;
  const parentId = req.query.parentId;

  const eBay = new eBayApi({
    ...ebayApiConfig,
    authToken: accessToken as string,
  });

  const categoriesBody: CategoriesBody = {
    DetailLevel: "ReturnAll",
    LevelLimit: level as string,
    ViewAllNodes: true,
  };

  if (parentId) {
    categoriesBody.CategoryParent = parentId as string;
  }

  const response = await eBay.trading.GetCategories({ ...categoriesBody });
  res.json(response);
});

router.get("/seller-list", async (req: Request, res: Response) => {
  const accessToken = req.headers["x-ebay-access-token"];
  const ebayApiConfig = generateEbayApiConfig();

  const eBay = new eBayApi({
    ...ebayApiConfig,
    authToken: accessToken as string,
  });

  const response = await eBay.trading.GetMyeBaySelling({
    ActiveList: { Include: true },
    DeletedFromSoldList: { Include: true },
    SoldList: { Include: true },
    Pagination: { EntriesPerPage: 25000, PageNumber: 1 },
  });

  if (!("Ack" in response)) {
    res.status(400).json({ message: "Error encountered!" });
  }

  const activeList: any[] = response?.ActiveList?.ItemArray?.Item ?? [];
  const soldList: any[] = response?.SoldList?.OrderTransactionArray?.OrderTransaction ?? [];

  if (activeList) {
    const mappedActiveList = activeList.map((row) => console.log("active list: ", row));
  }

  if (soldList) {
    const mappedSoldList = soldList.map((row) => console.log("mapped sold List : ", row));
  }

  // Active items

  //   const id = req.params.id;
  //   const item = await Item.findById(id);
  //   res.json({ message: "Successfully retrieved item!", data: item });
  res.json({ message: "Test" });
});
export default router;
