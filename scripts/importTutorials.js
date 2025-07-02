const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const tutorialsDir = path.join(__dirname, "../public/tutorials/javascript");
  const files = fs.readdirSync(tutorialsDir);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const slug = file.replace(".json", "");
    if (slug === "topics") {
      console.warn(`Skipped file: ${slug}`);
      continue;
    }
    const filePath = path.join(tutorialsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8").trim();
    if (!fileContent) {
      console.warn(`Skipped empty file: ${file}`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(fileContent);
    } catch (e) {
      console.error(`Invalid JSON in file: ${file}`);
      continue;
    }
    const translations = Object.entries(data)
      .map(([lang, value]) => {
        if (!value.title || !value.description) {
          console.warn(`Skipped translation for ${slug} (${lang}) due to missing title/description.`);
          return null;
        }
        return {
          language: lang,
          title: value.title,
          description: value.description,
          content: value.content,
        };
      })
      .filter(Boolean);
    if (translations.length === 0) {
      console.warn(`Skipped file: ${slug} (no valid translations)`);
      continue;
    }
    await prisma.tutorial.upsert({
      where: { slug },
      update: {
        translations: {
          deleteMany: {},
          create: translations,
        },
      },
      create: {
        slug,
        translations: {
          create: translations,
        },
      },
    });
    console.log(`Imported: ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
