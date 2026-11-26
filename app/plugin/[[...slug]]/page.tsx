import { pluginSource } from "@/lib/source";
import { DocsBody, DocsDescription, DocsPage } from "@/layouts/docs/page";
import { PageTitle } from "@/components/docs/page-title";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";

/** Renders a page of the `/plugin` section from its MDX source. */
export default async function Page(props: PageProps<"/plugin/[[...slug]]">) {
  const params = await props.params;
  const page = pluginSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <PageTitle title={page.data.title} icon={page.data.icon} />
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(pluginSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

/** Every page of the section, for static generation. */
export async function generateStaticParams() {
  return pluginSource.generateParams();
}

/** Title and description of a page. */
export async function generateMetadata(props: PageProps<"/plugin/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = pluginSource.getPage(params.slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
