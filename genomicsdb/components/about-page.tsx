"use client"

import "./about-page.css"

export function AboutPage() {
  return (
    <div className="max-text-width">
      {/* About the Project */}
      <section className="about-section">
        <h2>About the Project</h2>
        <p>
          The NIAGADS Alzheimer's Genomics Database is developed by a team of researchers at the University of
          Pennsylvania as part of the National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
          (NIAGADS), a national genetics repository created by NIA to facilitate access to genotypic data for the study
          of the genetics of late-onset Alzheimer's disease.
        </p>
        <p>
          We welcome the involvement of interested researchers.
          <a href="https://www.niagads.org/qualified-access-data/" className="link">Click here</a> to learn more about contributing data or making formal data access
          requests. Or <a href="https://dss.niagads.org/contact" className="link">contact us</a> for more information.
        </p>
        <p>
          The GenomicsDB is a collaboration among the following organizations: National Institute on Aging,
          Alzheimer's Disease Sequencing Project (ADSP), and Perelman School of Medicine at the University of
          Pennsylvania.
        </p>
      </section>

      {/* How to Cite */}
      <section className="about-section">
        <h2>How to Cite</h2>
        <p>
          We encourage you to use the data and insights offered in the NIAGADS Alzheimer's Genomics Database along with
          the following acknowledgement statement:
        </p>
        <blockquote>
          The results published here are in whole or part based on data obtained from the NIAGADS Alzheimer's GenomicsDB,
          available at https://www.niagads.org/genomics.
        </blockquote>
        <p>To cite this resource:</p>
        <blockquote>
          Greenfest-Allen et al. (28 April 2023). "NIAGADS Alzheimer's GenomicsDB: A resource for exploring Alzheimer's
          Disease genetic and genomic knowledge":
          <a
            href="https://doi.org/10.1101/2020.09.23.310276"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            https://doi.org/10.1101/2020.09.23.310276
          </a>
        </blockquote>
        <p>
          If referencing a specific GWAS summary statistics dataset, please follow the accession link provided in the dataset browser
          to obtain original publication information.
        </p>
      </section>

      {/* FAQ */}
      <section className="about-section">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How were GRCh38 datasets lifted over from GRCh37?</summary>
          <p>
            If variants were identified by dbSNP refSNP IDs, GRCh38 coordinates are determined by mapping the ID
            against the GenomicsDB reference set with checks for deprecated rsIDs. Otherwise, a two-stage lift over
            process is used: UCSC liftOver followed by NCBI Remap. Unmapped/ambiguous variants and long indels were
            excluded.
          </p>
        </details>

        <details>
          <summary>How was Linkage Disequilibrium (LD) calculated?</summary>
          <p>
            LD for 1000 Genomes super populations was calculated using PLINK. Only r² ≥ 0.2 values are stored. LD for
            ADSP R3 17k WGS samples was estimated with emeraLD. Updates will be included with future ADSP WGS releases.
          </p>
        </details>

        <details>
          <summary>How can I load my own tracks into the genome browser?</summary>
          <p>You can pass URL parameters like:</p>
          <ul>
            <li><code>locus=APOE</code></li>
            <li><code>track=ADSP_R4,NG00075_GRCh38_STAGE1</code></li>
            <li><code>file=https://example.com/file.bed.gz</code></li>
            <li><code>indexed=true</code> if file has a .tbi</li>
          </ul>

        </details>

        <details>
          <summary>Why do some annotated tracks load slowly?</summary>
          <p>
            Large annotated tracks take time to render client-side in the NIAGADS Genome Browser. Performance depends on
            your browser and system. Chrome is recommended.
          </p>
        </details>
      </section>

      {/* Data Sources */}
      <section className="about-section">
        <h2>Data Sources</h2>
        <h3>Ontologies</h3>
        <p>
          The GenomicsDB uses ontologies to capture phenotypes, biosample types, and experimental design aspects.
          Ontologies help harmonize information into concept-related sections.
        </p>
        <div className="table-placeholder">[Ontology Table Placeholder]</div>

        <h3>Gene Annotation</h3>
        <p>
          Multiple public resources are used to annotate genes. More details are available on each gene's report page.
        </p>
        <div className="table-placeholder">[Gene Annotation Table Placeholder]</div>

        <h3>Variant Annotation</h3>
        <p>
          Variant annotations are aggregated from multiple databases. See variant report pages for detailed usage.
        </p>
        <div className="table-placeholder">[Variant Annotation Table Placeholder]</div>
      </section>
    </div>
  )
}
