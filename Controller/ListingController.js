const Listing = require("../Models/ListingSchema.js");
const PDFDocument = require("pdfkit");
const https = require("https");
const path = require("path");

module.exports.homePage = async (req, res) => {
  const listing = await Listing.find();
  res.render("./Listings/index.ejs", { listing });
};

module.exports.ListingPage = async (req, res) => {
  let user = null;
  if (req.user) {
    user = req.user;
  }
  const data = await Listing.find();
  res.render("./Listings/listingHome.ejs", { listings: data, user });
};

module.exports.newListingForm = async (req, res) => {
  res.render("./Listings/listingForm.ejs");
};

module.exports.saveNewListing = async (req, res) => {
  const {
    title,
    description,
    type,
    size,
    purpose,
    price,
    area,
    city,
    state,
    pincode,
  } = req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing({
    title: title,
    description: description,
    type: type,
    size: size,
    purpose: purpose,
    price: price,
    area: area,
    city: city,
    state: state,
    pincode: pincode,
  });
  newListing.image.filename = filename;
  newListing.image.url = url;
  newListing.owner = req.user;
  const savedListing = await newListing.save();
  req.flash("success", "Property was listed successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id).populate("owner");
  if (!listing) {
    req.flash("error", "Property not found!");
    return res.redirect("/listings");
  }
  res.render("./Listings/show.ejs", { listing });
};

module.exports.termsCondition = async (req, res) => {
  res.render("./Listings/terms&conditions.ejs");
};

module.exports.filterListings = async (req, res) => {
  const { city, state, min_price, max_price } = req.body;
  const filter = {};
  if (city && city.trim() !== "") {
    filter.city = city;
  }
  if (state && state.trim() !== "") {
    filter.state = state;
  }
  filter.price = {
    $gte: min_price ? Number(min_price) : 0,
    $lte: max_price ? Number(max_price) : Number.MAX_SAFE_INTEGER,
  };
  const listings = await Listing.find(filter);
  if (listings.length == 0) {
    req.flash("error", "No properties found.");
    return res.redirect("/listings");
  }
  res.render("./Listings/listingHome.ejs", { listings });
};

module.exports.filterByCategory = async (req, res) => {
  const category = req.params.id;
  const listings = await Listing.find({ type: category });
  if (listings.length == 0) {
    req.flash("error", `No properties found for ${category} category.`);
    return res.redirect("/");
  }
  res.render("./Listings/listingHome.ejs", { listings });
};

module.exports.deleteListing = async (req, res) => {
  const id = req.params.id;
  try {
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Property deleted successfully.");
  } catch (err) {
    req.flash("error", "Error in deleting the property.");
  }
  return res.redirect(`/user/${req.user._id}/profile`);
};

module.exports.updateStatus = async (req, res, next) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "property not found.");
    }
    listing.currStatus = status;
    await listing.save();
    req.flash("success", "Property status updated successfully.");
  } catch (err) {
    req.flash("error", "Error in updating property status");
  }
  res.redirect(`/user/${req.user._id}/agent`);
};

module.exports.downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("owner")
      .populate("agent");
    if (!listing) return res.status(404).send("Listing not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${listing.title.replace(/\s+/g, "_")}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // === HEADER BAR ===
    const pageWidth = doc.page.width;
    doc.rect(0, 0, pageWidth, 70).fill("#0d6efd");
    doc
      .fillColor("white")
      .fontSize(22)
      .text("HavenSeek Property Report", 50, 25, { align: "center" });

    doc.moveDown(1.5);
    doc.fillColor("#222").fontSize(20).text(listing.title, { align: "center" });
    doc
      .fontSize(13)
      .fillColor("#555")
      .text(`${listing.area}, ${listing.city}, ${listing.state}`, {
        align: "center",
      });

    doc.moveDown(0.8);
    doc
      .moveTo(50, doc.y)
      .lineTo(pageWidth - 50, doc.y)
      .strokeColor("#ccc")
      .lineWidth(1)
      .stroke();
    doc.moveDown(1);

    // === IMAGE ===
    const addImage = async () => {
      if (!listing.image?.url) return;
      return new Promise((resolve) => {
        https
          .get(listing.image.url, (resp) => {
            const chunks = [];
            resp.on("data", (chunk) => chunks.push(chunk));
            resp.on("end", () => {
              try {
                const buffer = Buffer.concat(chunks);
                const imgY = doc.y;
                doc.image(buffer, 60, imgY, {
                  fit: [pageWidth - 120, 240],
                  align: "center",
                });
                // move below image with smaller spacing
                doc.moveDown(10);
              } catch {
                doc
                  .fillColor("red")
                  .text("(Image could not be loaded)", { align: "center" });
              }
              resolve();
            });
          })
          .on("error", () => {
            doc
              .fillColor("red")
              .text("(Image could not be loaded)", { align: "center" });
            resolve();
          });
      });
    };
    await addImage();
    doc.moveDown(8.5);
    // === SECTION TITLE FUNCTION ===
    const sectionTitle = (title) => {
      const sectionY = doc.y + 5;
      doc
        .rect(45, sectionY, pageWidth - 90, 25)
        .fill("#e8f0fe")
        .stroke("#0d6efd");
      doc
        .fillColor("#0d6efd")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(title, 60, sectionY + 6);
      doc.y = sectionY + 35; // precisely position below box
      doc.fillColor("#000").font("Helvetica");
    };
    doc.moveDown(1);

    // === PROPERTY DETAILS ===
    sectionTitle("Property Details");
    const details = [
      ["Purpose", listing.purpose],
      ["Type", listing.type],
      ["Status", listing.currStatus],
      [
        "Price",
        `${listing.price.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        })}`,
      ],
      ["Size", `${listing.size} sq.ft`],
    ];
    details.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
      doc.font("Helvetica").text(value || "N/A");
    });
    doc.moveDown(1);

    // === LOCATION ===
    sectionTitle("Location Details");
    doc.text(`Area: ${listing.area}`);
    doc.text(`City: ${listing.city}`);
    doc.text(`State: ${listing.state}`);
    doc.text(`Pincode: ${listing.pincode}`);
    doc.moveDown(1);

    // === OWNER ===
    sectionTitle("Owner Details");
    doc.text(`Name: ${listing.owner?.name || "N/A"}`);
    doc.text(`Mobile: ${listing.owner?.mobile || "N/A"}`);
    doc.text(`E-mail: ${listing.owner?.email || "N/A"}`);
    doc.moveDown(1);

    // === AGENT ===
    sectionTitle("Agent Details");
    doc.text(`Name: ${listing.agent?.name || "N/A"}`);
    doc.text(`Mobile: ${listing.agent?.mobile || "N/A"}`);
    doc.text(`E-mail: ${listing.agent?.email || "N/A"}`);
    doc.moveDown(1);

    // === DESCRIPTION ===
    sectionTitle("Description");
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#333")
      .text(listing.description || "N/A", {
        align: "justify",
      });

    // === SIGNATURES SECTION ===
    doc.moveDown(4); // Space before signatures
    const ceoSig = path.join(__dirname, "../public/Assets/Samman_Jaiswal.jpg");
    const founderSig = path.join(
      __dirname,
      "../public/Assets/Sahil_Jayant.jpg"
    );

    // Choose a fixed Y value for signatures
    const signatureY = doc.y;
    const leftX = 80;
    const rightX = pageWidth - 180; // Adjust as needed to match right position

    try {
      doc.image(ceoSig, leftX, signatureY, { width: 100 });
    } catch (e) {
      doc.text("Samman Jaiswal (Signature Missing)", leftX, signatureY);
    }

    try {
      doc.image(founderSig, rightX, signatureY, { width: 100 });
    } catch (e) {
      doc.text("Sahil Jayant (Signature Missing)", rightX, signatureY);
    }

    // move Y below the signatures (ensuring enough vertical space for both)
    const belowSigY = signatureY + 60; // 60 = height of the signature plus some space

    // === LABELS ===
    doc
      .fontSize(11)
      .fillColor("#000")
      .text("Samman Jaiswal", leftX, belowSigY)
      .text("CEO, HavenSeek", leftX, belowSigY + 13, { fillColor: "#0d6efd" });

    doc
      .fontSize(11)
      .fillColor("#000")
      .text("Sahil Jayant", rightX, belowSigY)
      .text("Founder, HavenSeek", rightX, belowSigY + 13, {
        fillColor: "#0d6efd",
      });

    // === FOOTER ===
    doc.moveDown(5);
    doc.x = 0; // not required, but may help

    doc
      .fontSize(10)
      .fillColor("#666")
      .text(`Generated by HavenSeek | © ${new Date().getFullYear()}`, {
        align: "center",
      });
    doc.end();
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    res.status(500).send("Error generating PDF");
  }
};
