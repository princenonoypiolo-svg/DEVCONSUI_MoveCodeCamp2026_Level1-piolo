const GRAPHQL_ENDPOINTS = {
  testnet: "https://graphql.testnet.sui.io/graphql",
  mainnet: "https://graphql.mainnet.sui.io/graphql",
} as const;

export type SuiNetwork = keyof typeof GRAPHQL_ENDPOINTS;

export async function querySuiGraphql<T>(
  network: SuiNetwork,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINTS[network], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Sui GraphQL request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || "Sui GraphQL request failed");
  }

  return payload.data as T;
}