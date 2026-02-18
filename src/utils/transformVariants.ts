export function transformVariants(variants: any[]) {
  return variants.map((variant) => {
    const metricValueAttr = variant.attributes.find(
      (attr: any) => attr.name === "MetricValue"
    );
    const metricTypeAttr = variant.attributes.find(
      (attr: any) => attr.name === "MetricType"
    );

    const metricValue = metricValueAttr?.value || "";
    const metricType = metricTypeAttr?.value || "";

    return {
      label: `${metricValue} ${metricType}`,
      value: variant.variantId,
    };
  });
}
