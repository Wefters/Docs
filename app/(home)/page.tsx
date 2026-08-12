import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "You write your app",
    description:
      "Vue, React, Angular, Svelte, or plain JS. The same code you'd already write for the web, running inside a native WebView, on Android or iOS.",
  },
  {
    number: "02",
    title: "You declare what native capability you need",
    description:
      "wefter add @yourorg/scanner-plugin installs a plugin package, validates it, and only if it passes, declares it in wefter.config.json.",
  },
  {
    number: "03",
    title: "wefter sync weaves it into a real native project",
    description:
      "Native source gets copied in, dependencies and permissions get merged, and a typed registry gets generated, all inside a disposable project you never hand-edit, for both platforms.",
  },
  {
    number: "04",
    title: "wefter run builds, installs, and launches it",
    description:
      "On a real device, emulator, or simulator, with live reload while you're actively developing.",
  },
];

const features = [
  {
    title: "No interpreter, no bundled backend",
    description:
      "Your app is JS running in a WebView, nothing else is spinning up underneath it. Native calls cross a single, typed bridge with no server process in between.",
  },
  {
    title: "Framework-agnostic, genuinely",
    description:
      "invokeNative and registerHook are plain function exports, not tied to any component model. Vue, React, Angular, Svelte, or plain JS all call the exact same two functions the exact same way.",
  },
  {
    title: "One codebase, two platforms",
    description:
      "The same JS runs on Android and iOS with no per-platform branching in your app code. Plugins are written natively per platform, but calling one looks identical either way.",
  },
  {
    title: "Small on purpose",
    description:
      "No custom rendering engine, no framework runtime baked into the shell. Compiled app size is a tracked constraint, checked in CI, not an afterthought.",
  },
  {
    title: "Nothing added without your say-so",
    description:
      "Plugins are never auto-discovered from node_modules. wefter add validates a plugin, its manifest, its methods, that they actually match, before it's ever declared in your project.",
  },
  {
    title: "Native code you can actually read",
    description:
      "The generated project is a small, readable Kotlin shell on Android and Swift shell on iOS, plus whatever plugins you declare. Nothing hidden behind a compiled binary or proprietary format.",
  },
];

const frameworks = ["Vue", "React", "Angular", "Svelte", "Plain JS"];
const platforms = ["Android", "iOS"];

const destinations = [
  {
    title: "Docs",
    href: "/docs",
    description: "Architecture, setup, and the full app configuration reference.",
  },
  {
    title: "Plugin",
    href: "/plugin",
    description: "Plugin anatomy, the native API surface, and a full worked tutorial.",
  },
  {
    title: "CLI",
    href: "/cli",
    description: "Every command, every flag, every failure mode, documented.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <h1 className="text-4xl font-semibold tracking-tight text-fd-foreground sm:text-5xl">
          Build native Android and iOS apps with the JavaScript you already know
        </h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">
          Wefter wraps your web app in a thin native shell and gives it
          typed, pluggable access to real device capability, camera,
          storage, biometrics, and more, through a lean bridge between
          JavaScript and the native side, Kotlin on Android, Swift on iOS.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/docs/introduction"
            className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
          >
            Read the introduction
          </Link>
        </div>

        {/* Quick-start code block */}
        <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-xl border border-fd-border bg-fd-card text-left">
          <div className="flex items-center gap-1.5 border-b border-fd-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/30" />
          </div>
          <pre className="overflow-x-auto px-4 py-4 text-sm">
            <code className="text-fd-foreground">
              <span className="text-fd-muted-foreground">$</span> npx wefter add @yourorg/scanner-plugin{"\n"}
              <span className="text-fd-muted-foreground">$</span> npx wefter run android --watch{"\n"}
              <span className="text-fd-muted-foreground"># swap android for ios, same command</span>
            </code>
          </pre>
        </div>

        {/* Platform badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs uppercase tracking-wide text-fd-muted-foreground">
            Ships to
          </span>
          {platforms.map((name) => (
            <span
              key={name}
              className="rounded-full border border-fd-primary/40 bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-foreground"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Framework badges */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs uppercase tracking-wide text-fd-muted-foreground">
            Works with
          </span>
          {frameworks.map((name) => (
            <span
              key={name}
              className="rounded-full border border-fd-border px-3 py-1 text-xs font-medium text-fd-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-fd-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-semibold text-fd-foreground">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <span className="text-2xl font-semibold text-fd-primary">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-semibold text-fd-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-fd-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-fd-muted-foreground">
            At runtime, your JS calls a native method through a single typed
            bridge call, <code className="text-fd-foreground">invokeNative(&apos;scanner&apos;, &apos;open&apos;, {"{}"})</code>,
            and gets a real Promise back, the same call on either platform.
            There&apos;s no local server sitting between your UI and your
            native code.
          </p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-t border-fd-border bg-fd-card/40">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-16 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-fd-border bg-fd-card p-6"
            >
              <h2 className="font-semibold text-fd-card-foreground">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Where to go next */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold text-fd-foreground">
          Where to go next
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="rounded-xl border border-fd-border p-6 transition-colors hover:bg-fd-accent"
            >
              <h3 className="font-semibold text-fd-foreground">
                {destination.title}
              </h3>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                {destination.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-fd-muted-foreground sm:flex-row">
          <p>Wefter is open source.</p>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-fd-foreground">
              Docs
            </Link>
            <Link href="/plugin" className="hover:text-fd-foreground">
              Plugin
            </Link>
            <Link href="/cli" className="hover:text-fd-foreground">
              CLI
            </Link>
            <a
              href="https://github.com"
              className="hover:text-fd-foreground"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}