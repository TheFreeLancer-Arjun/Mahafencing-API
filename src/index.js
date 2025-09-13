const express = require("express");
const cors = require("cors");




const AdminRouter = require("./routes/AdminRoutes");
const AnnualReportRouter = require("./routes/AnnualReportRoutes");
const BannerImageRouter = require("./routes/BannerImageRoutes");
const BlueCardRouter = require("./routes/BlueCardRoutes");
const DistSportAwardeeRouter = require("./routes/DistSportAwardeeRoutes");
const GetInTouchRouter = require("./routes/GetInTouchRoutes");
const InternationalMedalistRouter = require("./routes/InternationalMedalistRoutes");
const MahafencingRouter = require("./routes/MahafencingRoutes");
const MessageFromUserRouter = require("./routes/MessageFromUserRoutes");
const NationalMedalistRouter = require("./routes/NationalMedalistRoutes");
const NewsRouter = require("./routes/NewsRoutes");
const NISCoachRouter = require("./routes/NISCoachRoutes");
const NumberStatsRouter = require("./routes/NumberStatsRoutes");
const OfficeBearerRouter = require("./routes/OfficeBearerRoutes");
const OfficeBearerStaticRouter = require("./routes/OfficeBearerStaticRoutes");
const OurGalleryRouter = require("./routes/OurGalleryRoutes");
const OurInspirationRouter = require("./routes/OurInspirationRoutes");
const OurPartnerRouter = require("./routes/ResearchRoutes");
const ResearchRouter = require("./routes/ResearchRoutes");
const ShivChhatrapatiAwardeeRouter = require("./routes/ShivChhatrapatiAwardeeRoutes");
const ShowGalleryRouter = require("./routes/ShowGalleryRoutes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://letmerecall.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.use("/api/v1/show-gallery", ShowGalleryRouter);
app.use("/api/v1/shivchhatrapati-awardee", ShivChhatrapatiAwardeeRouter);
app.use("/api/v1/research", ResearchRouter);
app.use("/api/v1/our-partner", OurPartnerRouter);
app.use("/api/v1/our-inspiration", OurInspirationRouter);
app.use("/api/v1/our-gallery", OurGalleryRouter);
app.use("/api/v1/office-bearer-static", OfficeBearerStaticRouter);
app.use("/api/v1/office-bearer", OfficeBearerRouter);
app.use("/api/v1/number-stats", NumberStatsRouter);
app.use("/api/v1/nis-coach", NISCoachRouter);
app.use("/api/v1/news", NewsRouter);
app.use("/api/v1/national-medalist", NationalMedalistRouter);
app.use("/api/v1/message-from-user", MessageFromUserRouter);
app.use("/api/v1/mahafencing", MahafencingRouter);
app.use("/api/v1/international-medalist", InternationalMedalistRouter);
app.use("/api/v1/get-in-touch", GetInTouchRouter);
app.use("/api/v1/dist-sport-awardee", DistSportAwardeeRouter);
app.use("/api/v1/blue-card", BlueCardRouter);
app.use("/api/v1/banner-image", BannerImageRouter);
app.use("/api/v1/annual-report", AnnualReportRouter);
app.use("/api/v1/admin", AdminRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
