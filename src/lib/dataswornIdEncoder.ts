export function encodeDataswornId(id: string) {
  return encodeURIComponent(id);
}

export function decodeDataswornId(id: string) {
  return decodeURIComponent(id);
}

export function generateCustomDataswornId(
  idPrefix: string,
  idContents: string
) {
  return `${idPrefix}/custom/${encodeContents(idContents)}`;
}

export function generateAssetDataswornId(
  assetGroupId: string,
  idContents: string
) {
  return `${assetGroupId}/${encodeContents(idContents)}`;
}

export function encodeContents(content: string) {
  const sanitizedId = content
    .replace(/\s/g, "_")
    .replace(/\//g, "")
    .toLocaleLowerCase();

  if (!sanitizedId) {
    throw new Error("Failed to generate custom id");
  }

  return sanitizedId;
}

const defaultRegex = new RegExp(/^([a-z0-9_]{3,})$/);
const defaultReplaceRegex = new RegExp(/[^a-z0-9_]/g);
export function convertIdPart(
  idPart: string,
  config?: {
    testRegex?: RegExp;
    replaceRegex?: RegExp;
    replaceNumbers?: boolean;
  }
) {
  const {
    testRegex = defaultRegex,
    replaceRegex = defaultReplaceRegex,
    replaceNumbers,
  } = config ?? {};

  let newIdPart = idPart.toLocaleLowerCase().replace(/\s/g, "_");

  if (replaceNumbers) {
    newIdPart = newIdPart
      .replace(/0/g, "zero")
      .replace(/1/g, "one")
      .replace(/2/g, "two")
      .replace(/3/g, "three")
      .replace(/4/g, "four")
      .replace(/5/g, "five")
      .replace(/6/g, "six")
      .replace(/7/g, "seven")
      .replace(/8/g, "eight")
      .replace(/9/g, "nine");
  }

  newIdPart = newIdPart.replace(replaceRegex, "");

  if (newIdPart.match(testRegex)) {
    return newIdPart;
  }

  throw new Error(
    `Failed to create valid ID: ID Part = ${idPart}, New ID Part = ${newIdPart}`
  );
}

export function encodeAndConstructDataswornId(
  homebrewId: string,
  midsection: string,
  idPart: string
) {
  return `${homebrewId.toLocaleLowerCase()}/${midsection}/${convertIdPart(
    idPart
  )}`;
}
