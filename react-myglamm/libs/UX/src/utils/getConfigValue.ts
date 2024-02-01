function getConfigValue(KEY: string, config: any, lang = "EN"): string | null {
  const result = config.common[KEY] || config[lang][KEY];

  if (result) {
    return result.value;
  }

  return null;
}

export default getConfigValue;
