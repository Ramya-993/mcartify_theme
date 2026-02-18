"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Constants for CSS Variables and Tabs
const CSS_VARIABLES_TO_FETCH = [
  // Colors
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--background",
  "--foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--card",
  "--card-foreground",
  // Typography
  "--font-sans",
  "--font-serif",
  "--font-mono",
  // Layout - Radii
  "--radius",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--radius-full",
  "--radius-none",
  // Layout - Shadows
  "--shadow-sm",
  "--shadow",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
  "--shadow-2xl",
  "--shadow-inner",
];

type TabKey = "basic" | "colors" | "typography" | "layout";

const TABS: { id: TabKey; label: string }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "colors", label: "Color Palette" },
  { id: "typography", label: "Typography" },
  { id: "layout", label: "Layout Styles" },
];

// Helper Components
const ColorSwatch = ({
  colorVarName,
  label,
  value,
}: {
  colorVarName: string;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 transition-colors">
    <div
      className="h-5 w-5 rounded-sm border border-border shrink-0"
      style={{
        backgroundColor: `var(--${colorVarName})`,
      }}
      title={`${label}: ${value || `var(--${colorVarName})`}`}
    />
    <div className="flex flex-col overflow-hidden">
      <span className="text-xs font-medium truncate">{label}</span>
      <code className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[180px]">
        {value || `var(--${colorVarName})`}
      </code>
    </div>
  </div>
);

const FontPreview = ({
  fontVarName,
  label,
  value,
}: {
  fontVarName: string;
  label: string;
  value: string | undefined;
}) => {
  const fontFamilyStyle = value
    ? { fontFamily: value }
    : { fontFamily: `var(${fontVarName})` };

  return (
    <div className="space-y-3 border border-border rounded-md p-3 sm:p-4 bg-background/30">
      <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
        <span className="text-sm font-semibold">{label}</span>
        <code
          className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]"
          style={fontFamilyStyle}
        >
          {value || fontVarName}
        </code>
      </div>
      <div className="space-y-5" style={fontFamilyStyle}>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Display
          </p>
          <p className="text-3xl sm:text-4xl font-bold">Aa Bb Cc</p>
          <p className="text-lg sm:text-xl">
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Weights
          </p>
          <div className="grid gap-1 text-sm">
            <p className="font-thin">Thin (100) - The quick brown fox</p>
            <p className="font-extralight">
              Extra Light (200) - The quick brown fox
            </p>
            <p className="font-light">Light (300) - The quick brown fox</p>
            <p className="font-normal">Regular (400) - The quick brown fox</p>
            <p className="font-medium">Medium (500) - The quick brown fox</p>
            <p className="font-semibold">
              Semibold (600) - The quick brown fox
            </p>
            <p className="font-bold">Bold (700) - The quick brown fox</p>
            <p className="font-extrabold">
              Extra Bold (800) - The quick brown fox
            </p>
            <p className="font-black">Black (900) - The quick brown fox</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Sizes
          </p>
          <div className="grid gap-2">
            <p className="text-xs">Extra Small (xs) - The quick brown fox</p>
            <p className="text-sm">Small (sm) - The quick brown fox</p>
            <p className="text-base">Base - The quick brown fox</p>
            <p className="text-lg">Large (lg) - The quick brown fox</p>
            <p className="text-xl">Extra Large (xl) - The quick brown fox</p>
            <p className="text-2xl">2x Large (2xl) - The quick brown fox</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Special Characters
          </p>
          <p className="text-base break-all">
            1234567890 !@#$%^&*()_+[]{}&apos;&quot;|\:;&lt;&gt;,.?/~`
          </p>
        </div>
      </div>
    </div>
  );
};

const ColorExampleDisplay = ({
  backgroundColorVar,
  colorVar,
  borderColorVar,
  text,
}: {
  backgroundColorVar: string;
  colorVar: string;
  borderColorVar: string;
  text: string;
}) => (
  <>
    <Button
      variant="outline"
      className="h-auto text-xs w-full py-1.5 px-2"
      style={{
        backgroundColor: `var(${backgroundColorVar})`,
        color: `var(${colorVar})`,
        borderColor: `var(${borderColorVar})`,
      }}
    >
      {text} on Button
    </Button>
    <div
      className="p-2 rounded text-xs text-center"
      style={{
        backgroundColor: `var(${backgroundColorVar})`,
        color: `var(${colorVar})`,
        border: `1px solid var(${borderColorVar})`,
      }}
    >
      {text} on Div
    </div>
  </>
);

const ColorPalette = ({ themeVars }: { themeVars: Record<string, string> }) => {
  const colorGroups = [
    {
      title: "Primary Colors",
      colors: [
        { name: "primary", example: "Primary" },
        { name: "primary-foreground", example: "Primary Text" },
      ],
    },
    {
      title: "Secondary Colors",
      colors: [
        { name: "secondary", example: "Secondary" },
        { name: "secondary-foreground", example: "Secondary Text" },
      ],
    },
    {
      title: "Accent Colors",
      colors: [
        { name: "accent", example: "Accent" },
        { name: "accent-foreground", example: "Accent Text" },
      ],
    },
    {
      title: "Background & Foreground",
      colors: [
        { name: "background", example: "Page Background" },
        { name: "foreground", example: "Default Text" },
        { name: "muted", example: "Muted Background" },
        { name: "muted-foreground", example: "Muted Text" },
      ],
    },
    {
      title: "Card Colors",
      colors: [
        { name: "card", example: "Card Background" },
        { name: "card-foreground", example: "Card Text" },
      ],
    },
    {
      title: "UI Element Colors",
      colors: [
        { name: "border", example: "Border Color" },
        { name: "input", example: "Input Background" },
        { name: "ring", example: "Focus Ring" },
      ],
    },
    {
      title: "State Colors",
      colors: [
        { name: "destructive", example: "Destructive Action" },
        { name: "destructive-foreground", example: "Destructive Text" },
      ],
    },
  ];

  const getExampleContent = (color: { name: string; example: string }) => {
    if (color.name.endsWith("-foreground")) {
      const baseColorName = color.name.replace("-foreground", "");
      return (
        <ColorExampleDisplay
          backgroundColorVar={`--${baseColorName}`}
          colorVar={`--${color.name}`}
          borderColorVar={`--${baseColorName}`}
          text={color.example}
        />
      );
    }

    return (
      <ColorExampleDisplay
        backgroundColorVar={`--${color.name}`}
        colorVar={`--${color.name}-foreground`}
        borderColorVar={`--${color.name}`}
        text={color.example}
      />
    );
  };

  return (
    <div className="space-y-6">
      {colorGroups.map((group) => (
        <div key={group.title} className="space-y-3">
          <h4 className="text-base font-semibold sticky top-0 bg-card py-1 z-[5]">
            {group.title}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.colors.map((color) => (
              <div
                key={color.name}
                className="space-y-2 p-3 border border-border rounded-md bg-background/40 hover:shadow-md transition-shadow"
              >
                <ColorSwatch
                  colorVarName={color.name}
                  label={color.example}
                  value={themeVars[`--${color.name}`]}
                />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {getExampleContent(color)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SpacingPreview = () => {
  const spaces = [
    "0",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "20",
    "24",
    "px",
  ];
  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold">Spacing Scale (0.25rem unit)</h4>
      <div className="grid gap-3 text-sm">
        {spaces.map((spaceKey) => {
          const isPixel = spaceKey === "px";
          const remValue = isPixel ? 1 / 16 : Number(spaceKey) * 0.25;
          const pxValue = remValue * 16;
          return (
            <div
              key={spaceKey}
              className="flex items-center gap-3 p-1.5 rounded hover:bg-muted/50"
            >
              <div className="w-20 text-xs font-mono shrink-0">
                p-{spaceKey}
              </div>
              <div
                className="h-4 bg-primary/40 rounded-sm"
                style={{ width: `${remValue}rem` }}
                title={`${remValue}rem`}
              />
              <div className="text-xs text-muted-foreground">
                {remValue.toFixed(isPixel ? 3 : 2)}rem ({pxValue.toFixed(0)}px)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ShadowPreview = () => {
  const shadows = [
    { varName: "--shadow-sm", label: "Small (sm)" },
    { varName: "--shadow", label: "Default" },
    { varName: "--shadow-md", label: "Medium (md)" },
    { varName: "--shadow-lg", label: "Large (lg)" },
    { varName: "--shadow-xl", label: "Extra Large (xl)" },
    { varName: "--shadow-2xl", label: "2X Large (2xl)" },
    { varName: "--shadow-inner", label: "Inner Shadow" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold">Shadows</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shadows.map(({ varName, label }) => (
          <div
            key={varName}
            className="flex items-center gap-3 p-3 border border-border rounded-md bg-background/40"
          >
            <div
              className="h-16 w-16 bg-card rounded-md flex items-center justify-center text-xs text-card-foreground"
              style={{
                boxShadow: `var(${varName}, 0 1px 3px 0 rgba(0,0,0,0.1))`,
              }}
            >
              Box
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium">{label}</div>
              <code className="text-xs text-muted-foreground">{varName}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BorderRadiusPreview = () => {
  const radii = [
    { varName: "--radius-none", label: "None", value: "0px" },
    { varName: "--radius-sm", label: "Small (sm)", value: "0.25rem" },
    { varName: "--radius", label: "Default", value: "0.5rem" },
    { varName: "--radius-md", label: "Medium (md)", value: "0.375rem" },
    { varName: "--radius-lg", label: "Large (lg)", value: "0.75rem" },
    { varName: "--radius-xl", label: "Extra Large (xl)", value: "1rem" },
    { varName: "--radius-2xl", label: "2X Large (2xl)", value: "1.5rem" },
    { varName: "--radius-full", label: "Full (Pill)", value: "9999px" },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-base font-semibold">Border Radius</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {radii.map(({ varName, label, value }) => (
          <div
            key={varName}
            className="flex flex-col items-center gap-2 p-3 border border-border rounded-md bg-background/40"
          >
            <div
              className="h-12 w-12 border-2 border-primary/50 bg-primary/10 flex items-center justify-center text-xs text-primary-foreground"
              style={{
                borderRadius: `var(${varName}, ${value})`,
              }}
            >
              Test
            </div>
            <div className="text-center">
              <span className="text-xs block font-medium">{label}</span>
              <code className="text-xs text-muted-foreground">{varName}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function ThemeDebugger() {
  const { store } = useSelector((state: RootState) => state.store);
  const { theme, systemTheme } = useTheme();
  const storeID = store?.storeId || "default";
  const themeID = store?.themeId || "default";
  const serviceName = store?.serviceName || "default"

  const [themeVars, setThemeVars] = React.useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabKey>("basic");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const htmlElement = document.documentElement;
    const computedStyles = getComputedStyle(htmlElement);
    const newThemeVars: Record<string, string> = {};

    CSS_VARIABLES_TO_FETCH.forEach((varNameWithDash) => {
      const value = computedStyles
        .getPropertyValue(varNameWithDash.trim())
        .trim();
      if (value) {
        newThemeVars[varNameWithDash] = value;
      }
    });
    setThemeVars(newThemeVars);
  }, [theme, systemTheme, storeID, themeID]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5 text-sm p-3 border border-border rounded-md bg-background/40 shadow-sm">
              <p>
                <span className="font-semibold text-muted-foreground">
                  Store ID:
                </span>{" "}
                {storeID}
              </p>
              <p>
                <span className="font-semibold text-muted-foreground">
                  Service Name:
                </span>{" "}
                {serviceName}
              </p>
              <p>
                <span className="font-semibold text-muted-foreground">
                  Theme ID:
                </span>{" "}
                {themeID}
              </p>
              <p>
                <span className="font-semibold text-muted-foreground">
                  Theme Key:
                </span>{" "}
                {`${storeID}-${themeID}`}
              </p>
              <p>
                <span className="font-semibold text-muted-foreground">
                  Active Theme:
                </span>{" "}
                {theme}
              </p>
              <p>
                <span className="font-semibold text-muted-foreground">
                  System Theme:
                </span>{" "}
                {systemTheme || "N/A"}
              </p>
            </div>
            <h4 className="text-sm font-semibold mt-4 text-muted-foreground">
              Key Variables:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ColorSwatch
                colorVarName="primary"
                label="Primary"
                value={themeVars["--primary"]}
              />
              <ColorSwatch
                colorVarName="background"
                label="Background"
                value={themeVars["--background"]}
              />
              <ColorSwatch
                colorVarName="accent"
                label="Accent"
                value={themeVars["--accent"]}
              />
              <ColorSwatch
                colorVarName="foreground"
                label="Foreground"
                value={themeVars["--foreground"]}
              />
              <ColorSwatch
                colorVarName="card"
                label="Card"
                value={themeVars["--card"]}
              />
              <ColorSwatch
                colorVarName="border"
                label="Border"
                value={themeVars["--border"]}
              />
            </div>
          </div>
        );
      case "colors":
        return <ColorPalette themeVars={themeVars} />;
      case "typography":
        return (
          <div className="space-y-6">
            <FontPreview
              fontVarName="--font-sans"
              label="Sans Serif Font"
              value={themeVars["--font-sans"]}
            />
            <FontPreview
              fontVarName="--font-serif"
              label="Serif Font"
              value={themeVars["--font-serif"]}
            />
            <FontPreview
              fontVarName="--font-mono"
              label="Monospace Font"
              value={themeVars["--font-mono"]}
            />
          </div>
        );
      case "layout":
        return (
          <div className="space-y-8">
            <BorderRadiusPreview />
            <SpacingPreview />
            <ShadowPreview />
          </div>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Select a tab to view details.
          </p>
        );
    }
  };

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[100] p-0 bg-card text-card-foreground rounded-lg shadow-2xl border border-border 
                   w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 
                   overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[85vh] transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between p-3 sm:p-3 border-b border-border sticky top-0 bg-card/80 backdrop-blur-sm z-10">
        <h3 className="font-semibold text-sm sm:text-base">Theme Debugger</h3>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="text-xs px-2 py-0.5 h-auto"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      <div className="overflow-y-auto flex-grow p-3 sm:p-4">
        {!isExpanded ? (
          <div className="space-y-1 text-xs">
            <p>
              <span className="font-medium text-muted-foreground">Store:</span>{" "}
              {storeID}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Theme:</span>{" "}
              {themeID}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Mode:</span>{" "}
              {theme} ({systemTheme || "N/A"})
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground">Primary:</span>
              <div
                className="h-4 w-4 rounded border border-border"
                style={{
                  backgroundColor: themeVars["--primary"] || "transparent",
                }}
              ></div>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">Background:</span>
              <div
                className="h-4 w-4 rounded border border-border"
                style={{
                  backgroundColor: themeVars["--background"] || "transparent",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-1 sm:gap-1.5 mb-3 sm:mb-4 overflow-x-auto pb-1.5 -mx-1 px-1 border-b border-border sticky top-0 bg-card/80 backdrop-blur-sm z-[8]">
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1 h-auto"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            {renderTabContent()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeDebugger;
 