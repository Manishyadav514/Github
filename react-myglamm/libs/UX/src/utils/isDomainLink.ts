export default function isDomainLink(url: any) {
  let domainArr = [
    "myglamm",
    "thesirona",
    "babychakra",
    "themomsco",
    "stbotanica",
    "organicharvest",
    "popxo",
    "missmalini",
    "scoopwhoop",
    "vidooly",
  ];

  let domainLink = true;
  try {
    const breakPath = url.split("/");
    domainLink = domainArr?.some(ele => breakPath[2].toLowerCase().includes(ele.toLowerCase()));
  } catch (e) {
    // no-op
  }

  return domainLink;
}
