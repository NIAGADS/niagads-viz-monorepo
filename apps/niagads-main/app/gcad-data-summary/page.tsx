const GcadDataSummary = () => {
    return (
        <article id="post-36" className="entry post-36 page type-page status-publish hentry">
            <div className="entry-header">
                <h1 className="entry-title">Data</h1>
                <div className="entry-meta"></div>
            </div>
            <div className="entry-content">
                <div className="data-section">
                    <div className="top-intro">
                        GCAD receives sequencing data from ADSP or other collaborators. The WGS/WES data will then be
                        processed into CRAMs, gVCFs and project level VCFs in GRCh38. These data will then be QC-ed and
                        annotated, and shared via NIAGADS to the community.
                    </div>
                    <figure className="top-graph gcad-workflow"></figure>
                </div>
                <div
                    className="wp-block-group alignfull has-background"
                    /*style="margin-top:60px; background-color:#f1f1f1"*/
                >
                    <div className="wp-block-group__inner-container">
                        <div /*style="height:60px"*/ aria-hidden="true" className="wp-block-spacer"></div>
                        <h2 id="production">Data&nbsp;Production </h2>
                        <p className="intro">
                            Once we receive new sequencing, the samples are processed into CRAMs/gVCFs and stored until
                            ready to joint genotype call into a project level VCF (pVCF). GCAD will generate one pVCF
                            containing all new and previously generated gVCFs once per year. These pVCFs then undergo
                            ADSP QC and are deposited into NIAGADS for the research community for access. The tables
                            below provide an update on what data has been processed.
                        </p>
                        <div /*style="height:20px"*/ aria-hidden="true" className="wp-block-spacer"></div>
                        <figure className="wp-block-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Dataset Round</th>
                                        <th>Number of Samples</th>
                                        <th>WGS/WES</th>
                                        <th>Status</th>
                                        <th>CRAM/gVCF Release Date</th>
                                        <th>Preview pVCF Release Date</th>
                                        <th>QC pVCF Release Date</th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>Round 1</td>
                                    <td>4,789</td>
                                    <td>WGS</td>
                                    <td>Complete</td>
                                    <td>July 2018</td>
                                    <td>NA</td>
                                    <td>October 2018</td>
                                </tr>
                                <tr>
                                    <td>Round 2</td>
                                    <td>20,504</td>
                                    <td>WES</td>
                                    <td>Complete</td>
                                    <td>February 2020</td>
                                    <td>NA</td>
                                    <td>September 2020</td>
                                </tr>
                                <tr>
                                    <td>Round 3</td>
                                    <td>16,905</td>
                                    <td>WGS</td>
                                    <td>Complete</td>
                                    <td>March 2021</td>
                                    <td>March 2021</td>
                                    <td>October 2021</td>
                                </tr>
                                <tr>
                                    <td>Round 4</td>
                                    <td>36,361</td>
                                    <td>WGS</td>
                                    <td>Complete</td>
                                    <td>October 2022</td>
                                    <td>October 2022</td>
                                    <td>August 2023</td>
                                </tr>
                                <tr>
                                    <td>Round 5</td>
                                    <td>58,507</td>
                                    <td>WGS</td>
                                    <td>In Process</td>
                                    <td>November 2024</td>
                                    <td>November 2024</td>
                                    <td>Anticipate late 2025</td>
                                </tr>
                                <tr>
                                    <td>Round 6</td>
                                    <td>~76,000</td>
                                    <td>WGS</td>
                                    <td>In Process</td>
                                    <td>Anticipate end 2026</td>
                                    <td>Anticipate end 2026</td>
                                    <td>TBD</td>
                                </tr>
                            </table>
                        </figure>
                        <div /*style="height:20px"*/ aria-hidden="true" className="wp-block-spacer"></div>
                        <figure id="gcad-data" className="wp-block-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Release</th>
                                        <th>Project Name</th>
                                        <th>WGS/WES</th>
                                        <th>Total Samples</th>
                                        <th>Data Received</th>
                                        <th>gVCFs Generated</th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td>R2</td>
                                    <td>ADSP-DiscoveryCC-WES</td>
                                    <td>WES</td>
                                    <td>10939</td>
                                    <td>Oct-17</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>WHICAP-AA-WES</td>
                                    <td>WES</td>
                                    <td>1131</td>
                                    <td>Apr-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>ADGC-AA-WES</td>
                                    <td>WES</td>
                                    <td>3225</td>
                                    <td>Jul-17</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>WHICAP-Hispanic-WES</td>
                                    <td>WES</td>
                                    <td>1829</td>
                                    <td>Jun-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>WHICAP-Caucasian-WES</td>
                                    <td>WES</td>
                                    <td>958</td>
                                    <td>Jul-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>MIAMI-WES</td>
                                    <td>WES</td>
                                    <td>114</td>
                                    <td>Oct-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>CBD-WES</td>
                                    <td>WES</td>
                                    <td>361</td>
                                    <td>May-20</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>PSP-WES</td>
                                    <td>WES</td>
                                    <td>704</td>
                                    <td>Apr-20</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>Knight ADRC-WES</td>
                                    <td>WES</td>
                                    <td>661</td>
                                    <td>Mar-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>ZORAN-WES</td>
                                    <td>WES</td>
                                    <td>77</td>
                                    <td>Oct-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R2</td>
                                    <td>FASe-WES</td>
                                    <td>WES</td>
                                    <td>1104</td>
                                    <td>Nov-18</td>
                                    <td>Jun-19</td>
                                </tr>
                                <tr>
                                    <td>R1;R3</td>
                                    <td>ADSP-ExtensionFam-WGS</td>
                                    <td>WGS</td>
                                    <td>444</td>
                                    <td>Dec-16</td>
                                    <td>Nov-19</td>
                                </tr>
                                <tr>
                                    <td>R1;R3</td>
                                    <td>ADSP-DiscoveryFam-WGS</td>
                                    <td>WGS</td>
                                    <td>584</td>
                                    <td>Jan-14</td>
                                    <td>Nov-19</td>
                                </tr>
                                <tr>
                                    <td>R1;R3</td>
                                    <td>ADSP-ExtensionCC-WGS</td>
                                    <td>WGS</td>
                                    <td>2959</td>
                                    <td>Jun-16</td>
                                    <td>Jan-20</td>
                                </tr>
                                <tr>
                                    <td>R1;R3</td>
                                    <td>ADNI-WGS1</td>
                                    <td>WGS</td>
                                    <td>809</td>
                                    <td>Sep-12</td>
                                    <td>Nov-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>CurePSP-Macrogen-WGS</td>
                                    <td>WGS</td>
                                    <td>886</td>
                                    <td>Jan-18</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>UPitt-Batch1-WGS</td>
                                    <td>WGS</td>
                                    <td>209</td>
                                    <td>Jul-17</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>CurePSP-UCLA-WGS</td>
                                    <td>WGS</td>
                                    <td>408</td>
                                    <td>Feb-18</td>
                                    <td>Nov-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>APOE-Extreme-WGS</td>
                                    <td>WGS</td>
                                    <td>885</td>
                                    <td>Oct-18</td>
                                    <td>Dec-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FUS-ADCAutopsy-WGS</td>
                                    <td>WGS</td>
                                    <td>2772</td>
                                    <td>Sep-19</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>CacheCounty-WGS</td>
                                    <td>WGS</td>
                                    <td>207</td>
                                    <td>Jul-17</td>
                                    <td>Dec-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>Knight ADRC-WGS</td>
                                    <td>WGS</td>
                                    <td>77</td>
                                    <td>Nov-18</td>
                                    <td>Jan-20</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FASe-WGS</td>
                                    <td>WGS</td>
                                    <td>91</td>
                                    <td>Nov-18</td>
                                    <td>Jan-20</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>Genentech-NACC-WGS</td>
                                    <td>WGS</td>
                                    <td>137</td>
                                    <td>Jan-19</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>CurePSP-USUHS-WGS</td>
                                    <td>WGS</td>
                                    <td>617</td>
                                    <td>Jul-19</td>
                                    <td>Aug-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FUS-PR1066-WGS</td>
                                    <td>WGS</td>
                                    <td>1517</td>
                                    <td>Sep-19</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FUS-ADGCAA-WGS1</td>
                                    <td>WGS</td>
                                    <td>1923</td>
                                    <td>Sep-19</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FUS-ADNI-WGS2</td>
                                    <td>WGS</td>
                                    <td>757</td>
                                    <td>Sep-19</td>
                                    <td>Nov-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FUS-HIHG-Brainbank-WGS</td>
                                    <td>WGS</td>
                                    <td>92</td>
                                    <td>Sep-19</td>
                                    <td>Feb-20</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>AMPAD-ROSMAP-WGS</td>
                                    <td>WGS</td>
                                    <td>730</td>
                                    <td>Jan-19</td>
                                    <td>Feb-20</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>AMPAD-ADMSSM-WGS</td>
                                    <td>WGS</td>
                                    <td>344</td>
                                    <td>Feb-19</td>
                                    <td>Nov-19</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>AMPAD-ADMAYO-WGS</td>
                                    <td>WGS</td>
                                    <td>252</td>
                                    <td>Feb-19</td>
                                    <td>Feb-20</td>
                                </tr>
                                <tr>
                                    <td>R3</td>
                                    <td>FUS-Stanford-WGS</td>
                                    <td>WGS</td>
                                    <td>214</td>
                                    <td>Nov-19</td>
                                    <td>Feb-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-EOAD-WGS</td>
                                    <td>WGS</td>
                                    <td>1009</td>
                                    <td>Apr-20</td>
                                    <td>Jun-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-MHAS-WGS</td>
                                    <td>WGS</td>
                                    <td>2653</td>
                                    <td>Apr-20</td>
                                    <td>Jul-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-Ibadan-WGS</td>
                                    <td>WGS</td>
                                    <td>965</td>
                                    <td>Jun-20</td>
                                    <td>Aug-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-CWAutopsy-WGS</td>
                                    <td>WGS</td>
                                    <td>176</td>
                                    <td>Aug-20</td>
                                    <td>Dec-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS- ADC-AA-WGS</td>
                                    <td>WGS</td>
                                    <td>306</td>
                                    <td>Aug-20</td>
                                    <td>Sep-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS- ADC- Amerindian-WGS</td>
                                    <td>WGS</td>
                                    <td>84</td>
                                    <td>Aug-20</td>
                                    <td>Sep-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-EFIGA-WGS</td>
                                    <td>WGS</td>
                                    <td>1086</td>
                                    <td>Aug-20</td>
                                    <td>Nov-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS- Miami-BrainBank-WGS</td>
                                    <td>WGS</td>
                                    <td>315</td>
                                    <td>Sep-20</td>
                                    <td>Dec-20</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>LASI-DAD-WGS</td>
                                    <td>WGS</td>
                                    <td>2767</td>
                                    <td>Nov-20 to Oct-21</td>
                                    <td>Nov-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-PRADI-WGS</td>
                                    <td>WGS</td>
                                    <td>744</td>
                                    <td>Jan-21</td>
                                    <td>Feb-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-CUADI-WGS</td>
                                    <td>WGS</td>
                                    <td>100</td>
                                    <td>Jan-21</td>
                                    <td>Feb-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-AMISH-WGS</td>
                                    <td>WGS</td>
                                    <td>1055</td>
                                    <td>Jan-21, May-21</td>
                                    <td>Seq-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-StepAD2-WGS</td>
                                    <td>WGS</td>
                                    <td>128</td>
                                    <td>Mar-21</td>
                                    <td>July-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-REAAADI-WGS</td>
                                    <td>WGS</td>
                                    <td>740</td>
                                    <td>Mar-21</td>
                                    <td>Sep-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-Rapid Decline-WGS</td>
                                    <td>WGS</td>
                                    <td>171</td>
                                    <td>Mar-21</td>
                                    <td>Aug-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>EOAD-WGS</td>
                                    <td>WGS</td>
                                    <td>3176</td>
                                    <td>May-21</td>
                                    <td>June-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>TARCC-WGS</td>
                                    <td>WGS</td>
                                    <td>1018</td>
                                    <td>Apr-21</td>
                                    <td>July-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-AD Peru-WGS</td>
                                    <td>WGS</td>
                                    <td>252</td>
                                    <td>May-21</td>
                                    <td>July-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-WRAP</td>
                                    <td>WGS</td>
                                    <td>1434</td>
                                    <td>Oct-21</td>
                                    <td>Nov-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-ADC Hispanics</td>
                                    <td>WGS</td>
                                    <td>1214</td>
                                    <td>Sep-21</td>
                                    <td>Nov-21</td>
                                </tr>
                                <tr>
                                    <td>R4</td>
                                    <td>FUS-NOMAS</td>
                                    <td>WGS</td>
                                    <td>778</td>
                                    <td>Sep-21</td>
                                    <td>Nov-21</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>UPitt-Kamboh2-WGS</td>
                                    <td>WGS</td>
                                    <td>209</td>
                                    <td>Sep-19</td>
                                    <td>Oct-19</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>ASPREE WGS</td>
                                    <td>WGS</td>
                                    <td>2795</td>
                                    <td>Jan-21</td>
                                    <td>May-24</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>GARD-WGS</td>
                                    <td>WGS</td>
                                    <td>2007</td>
                                    <td>Aug-21</td>
                                    <td>Oct-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>EOAD2</td>
                                    <td>WGS</td>
                                    <td>1264</td>
                                    <td>Nov-21</td>
                                    <td>Jan-22</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-A4</td>
                                    <td>WGS</td>
                                    <td>3385</td>
                                    <td>Feb-22</td>
                                    <td>May-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-RAPID-DECLINE2-WGS</td>
                                    <td>WGS</td>
                                    <td>65</td>
                                    <td>Mar-22</td>
                                    <td>May-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-CNSA-WGS</td>
                                    <td>WGS</td>
                                    <td>274</td>
                                    <td>Mar-22</td>
                                    <td>May-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>Wellderly-WGS</td>
                                    <td>WGS</td>
                                    <td>1207</td>
                                    <td>May-22</td>
                                    <td>Mar-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-ADNI-WGS-3</td>
                                    <td>WGS</td>
                                    <td>622</td>
                                    <td>Jun-22</td>
                                    <td>Feb-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-ADC-AA-WGS-2</td>
                                    <td>WGS</td>
                                    <td>767</td>
                                    <td>Jun-22</td>
                                    <td>Feb-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-PeADI2-WGS</td>
                                    <td>WGS</td>
                                    <td>265</td>
                                    <td>Aug-22, Jan-24</td>
                                    <td>Apr-23, Feb-24</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-CuADI2-WGS</td>
                                    <td>WGS</td>
                                    <td>27</td>
                                    <td>Aug-22</td>
                                    <td>May-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-NOMAS2-WGS</td>
                                    <td>WGS</td>
                                    <td>30</td>
                                    <td>Aug-22</td>
                                    <td>May-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-MexicanAPP-PSEN-WGS</td>
                                    <td>WGS</td>
                                    <td>66</td>
                                    <td>Aug-22</td>
                                    <td>Jul-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-KBASE-WGS</td>
                                    <td>WGS</td>
                                    <td>603</td>
                                    <td>Sep-22</td>
                                    <td>Feb-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>Apoe-longitudinal</td>
                                    <td>WGS</td>
                                    <td>88</td>
                                    <td>Jan-23</td>
                                    <td>Jan-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-STEPAD3-WGS</td>
                                    <td>WGS</td>
                                    <td>125</td>
                                    <td>Jan-23</td>
                                    <td>Mar-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>AmyloidImaging-WU</td>
                                    <td>WGS</td>
                                    <td>1113</td>
                                    <td>Feb-23, Nov-23</td>
                                    <td>Aug-23, Dec-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>AmyloidImaging-Pitt</td>
                                    <td>WGS</td>
                                    <td>1195</td>
                                    <td>Feb-23</td>
                                    <td>Nov-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-Amish2-WGS</td>
                                    <td>WGS</td>
                                    <td>96</td>
                                    <td>Apr-23</td>
                                    <td>May-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>UAB-ADRC-WGS</td>
                                    <td>WGS</td>
                                    <td>17</td>
                                    <td>May-23</td>
                                    <td>Jul-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-CWAutopsy2-WGS</td>
                                    <td>WGS</td>
                                    <td>40</td>
                                    <td>May-23</td>
                                    <td>Jul-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-ASPREE-WGS</td>
                                    <td>WGS</td>
                                    <td>342</td>
                                    <td>May-23</td>
                                    <td>Oct-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FUS-EFIGA2-WGS</td>
                                    <td>WGS</td>
                                    <td>1787</td>
                                    <td>Jun-23,Feb-24</td>
                                    <td>Nov-23, May-24</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>FASe2-WGS</td>
                                    <td>WGS</td>
                                    <td>659</td>
                                    <td>Nov-23</td>
                                    <td>Dec-23</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>APOE-Extremes2-WGS</td>
                                    <td>WGS</td>
                                    <td>27</td>
                                    <td>Nov-23</td>
                                    <td>Mar-24</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>HABS-HD-WGS</td>
                                    <td>WGS</td>
                                    <td>1362</td>
                                    <td>Jan-24</td>
                                    <td>Mar-24</td>
                                </tr>
                                <tr>
                                    <td>R5</td>
                                    <td>CU-Hispanics</td>
                                    <td>WGS</td>
                                    <td>2632</td>
                                    <td>Dec-23</td>
                                    <td>Jun-24</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-REGARDS-WGS</td>
                                    <td>WGS</td>
                                    <td>2161</td>
                                    <td>Feb-22</td>
                                    <td>Oct-23</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>Portuguese WGS</td>
                                    <td>WGS</td>
                                    <td>374</td>
                                    <td>Aug-23</td>
                                    <td>Mar-24</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-IDIBAPS-WGS</td>
                                    <td>WGS</td>
                                    <td>826</td>
                                    <td>Sep-23</td>
                                    <td>Nov-23</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-ISAVRAD-WGS</td>
                                    <td>WGS</td>
                                    <td>1130</td>
                                    <td>Apr-24, Sep-24, Oct-25</td>
                                    <td>Oct-24, Feb-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-WHICAP-WGS</td>
                                    <td>WGS</td>
                                    <td>414</td>
                                    <td>Feb-24</td>
                                    <td>Jan-25</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-PeADI3-WGS</td>
                                    <td>WGS</td>
                                    <td>295</td>
                                    <td>Dec-24, Sep-25</td>
                                    <td>Jan-25, Oct-25</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>HABS-HD2-WGS</td>
                                    <td>WGS</td>
                                    <td>2941</td>
                                    <td>Sep-24, May-25</td>
                                    <td>Apr-25, TBD</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>MHAS-WGS</td>
                                    <td>WGS</td>
                                    <td>2346</td>
                                    <td>Aug-24, Oct-24</td>
                                    <td>Jul-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-READD-HI-WGS</td>
                                    <td>WGS</td>
                                    <td>2325</td>
                                    <td>Nov-24, Sep-25, Apr-26</td>
                                    <td>May-25, Jan-26, Jul-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>AZAPOE2-WGS</td>
                                    <td>WGS</td>
                                    <td>240</td>
                                    <td>Feb-25, Apr-26</td>
                                    <td>May-25, Apr-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>GARD2-WGS</td>
                                    <td>WGS</td>
                                    <td>1976</td>
                                    <td>May-25</td>
                                    <td>Jul-25</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-Rush-WGS</td>
                                    <td>WGS</td>
                                    <td>1552</td>
                                    <td>Jun-25</td>
                                    <td>Oct-25</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-CUADI3-WGS</td>
                                    <td>WGS</td>
                                    <td>456</td>
                                    <td>Aug-25, Nov-25, Apr-26</td>
                                    <td>Oct-25, Jan-26, Aug-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>RUSH-Brazil-WGS</td>
                                    <td>WGS</td>
                                    <td>5523</td>
                                    <td>Jul-25, Feb-26, Jul-26</td>
                                    <td>Feb-26, Apr-26, Jul-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-GAPP-WGS</td>
                                    <td>WGS</td>
                                    <td>625</td>
                                    <td>Jun-25</td>
                                    <td>Mar-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-KBASE2-WGS</td>
                                    <td>WGS</td>
                                    <td>490</td>
                                    <td>Jun-25, Apr-26</td>
                                    <td>Mar-26, Jul-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-LOS-WGS</td>
                                    <td>WGS</td>
                                    <td>99</td>
                                    <td>Jun-25</td>
                                    <td>Nov-25</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-ACAD-WGS</td>
                                    <td>WGS</td>
                                    <td>521</td>
                                    <td>Aug-25</td>
                                    <td>Oct-25</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-MHAS2-WGS</td>
                                    <td>WGS</td>
                                    <td>1976</td>
                                    <td>Jan-26</td>
                                    <td>Jul-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-GLASS-WGS</td>
                                    <td>WGS</td>
                                    <td>186</td>
                                    <td>Apr-26</td>
                                    <td>Jun-26</td>
                                </tr>
                                <tr>
                                    <td>R6</td>
                                    <td>FUS-Rapid-Decline3-WGS</td>
                                    <td>WGS</td>
                                    <td>36</td>
                                    <td>Nov-24</td>
                                    <td>May-25</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-READD-AA-WGS</td>
                                    <td>WGS</td>
                                    <td>1871</td>
                                    <td>Dec-24, Apr-25, Sep-25, Dec-25, Apr-26</td>
                                    <td>Feb-25, Apr-25, Mar-26, TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-READD-AF-WGS</td>
                                    <td>WGS</td>
                                    <td>2211</td>
                                    <td>Apr-25, Sep-25, Apr-26, Jun-26</td>
                                    <td>May-25, Dec-25, TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>MLSFH-WGS</td>
                                    <td>WGS</td>
                                    <td>3431</td>
                                    <td>Mar-26</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>MENA-WGS</td>
                                    <td>WGS</td>
                                    <td>641</td>
                                    <td>Apr-26</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-VALIANT-WGS</td>
                                    <td>WGS</td>
                                    <td>228</td>
                                    <td>Apr-26</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-MexicanAPP-PSEN2-WGS</td>
                                    <td>WGS</td>
                                    <td>295</td>
                                    <td>May-26</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-Banner-WGS</td>
                                    <td>WGS</td>
                                    <td>121</td>
                                    <td>April-26</td>
                                    <td>Aug-26</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-ASPREE2-WGS</td>
                                    <td>WGS</td>
                                    <td>885</td>
                                    <td>June-26</td>
                                    <td>TBD</td>
                                </tr>
                                <tr>
                                    <td>R7</td>
                                    <td>FUS-CONGO-WGS</td>
                                    <td>WGS</td>
                                    <td>193</td>
                                    <td>July-26</td>
                                    <td>TBD</td>
                                </tr>
                            </table>
                        </figure>
                        <div /*style="height:50px"*/ aria-hidden="true" className="wp-block-spacer"></div>
                    </div>
                </div>

                <div /*style="height:50px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                <div className="wp-block-group alignfull hide has-background" /*style="background-color:#f1f1f1"*/>
                    <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                        <div /*style="height:60px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <h2 className="wp-block-heading" id="data-production">
                            Data&nbsp;Production{" "}
                        </h2>

                        <p className="intro wp-block-paragraph">
                            Once we receive new sequencing, the samples are processed into CRAMs/gVCFs and stored until
                            ready to joint genotype call into a project level VCF (pVCF). GCAD will generate one pVCF
                            containing all new and previously generated gVCFs once per year. These pVCFs then undergo
                            ADSP QC and are deposited into NIAGADS for the research community for access. The tables
                            below provide an update on what data has been processed.
                        </p>

                        <div /*style="height:20px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <figure id="gcad-data-rounds2" className="wp-block-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Dataset Round</th>
                                        <th>Number of Samples</th>
                                        <th>WGS/WES</th>
                                        <th>Status</th>
                                        <th>CRAM/gVCF Release Date</th>
                                        <th>pVCF Release Date</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </figure>

                        <div /*style="height:20px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <div className="wp-block-kadence-accordion alignnone">
                            <div
                                className="kt-accordion-wrap kt-accordion-id36_0829f3-39 kt-accordion-has-3-panes kt-active-pane-0 kt-accordion-block kt-pane-header-alignment-left kt-accodion-icon-style-arrow kt-accodion-icon-side-right"
                                /*style="max-width:none"*/
                            >
                                <div
                                    className="kt-accordion-inner-wrap"
                                    data-allow-multiple-open="false"
                                    data-start-open="0"
                                >
                                    <div className="wp-block-kadence-pane kt-accordion-pane kt-accordion-pane-3 kt-pane36_bdd0f6-41">
                                        <div className="kt-accordion-header-wrap">
                                            <button
                                                className="kt-blocks-accordion-header kt-acccordion-button-label-show"
                                                type="button"
                                            >
                                                <span className="kt-blocks-accordion-title-wrap">
                                                    <span className="kt-blocks-accordion-title">
                                                        Show/Hide GCAD Table
                                                    </span>
                                                </span>
                                                <span className="kt-blocks-accordion-icon-trigger"></span>
                                            </button>
                                        </div>
                                        <div className="kt-accordion-panel kt-accordion-panel-hidden">
                                            <div className="kt-accordion-panel-inner">
                                                <figure id="gcad-data2" className="wp-block-table">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Release</th>
                                                                <th>Project name</th>
                                                                <th>WGS/WES</th>
                                                                <th>Total Samples</th>
                                                                <th>Received</th>
                                                                <th>gVCFs Generated</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody></tbody>
                                                    </table>
                                                </figure>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div /*style="height:50px"*/ aria-hidden="true" className="wp-block-spacer"></div>
                    </div>
                </div>

                <div className="wp-block-group alignfull">
                    <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                        <div /*style="height:60px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <h2 className="wp-block-heading">Pipeline</h2>

                        <p className="wp-block-paragraph">All pipelines are co-developed with ADSP investigators. </p>

                        <div /*style="height:50px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <h3 className="wp-block-heading">VCPA pipeline </h3>

                        <p className="wp-block-paragraph">
                            The SNP/Indel Variant Calling Pipeline and data management tool (VCPA) is the official
                            pipeline used for processing all the WGS/WES data in GCAD. It is a functional equivalent
                            pipeline jointly developed by GCAD/ADSP and CCDG/TOPMed. It outputs a CRAM (after
                            recalibration and indel realignment) as well as a gVCF (generated using GATK
                            haplotypecaller).{" "}
                        </p>

                        <div /*style="height:30px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <div className="wp-block-image">
                            <figure className="aligncenter size-large is-resized"></figure>
                        </div>

                        <div /*style="height:30px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <p className="wp-block-paragraph">
                            For more information go to <a href="https://www.adgenomics.org/vcpa/">VCPA page</a>.
                        </p>

                        <div /*style="height:50px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <h3 className="wp-block-heading">QC pipeline </h3>

                        <div className="wp-block-image">
                            <figure className="aligncenter size-full is-resized"></figure>
                        </div>

                        <p className="wp-block-paragraph">
                            Project level VCF is QC-ed via a multi-stage process. 1) pre-QC quality checks are
                            performed, including concordance with GWAS data, sample contamination,
                            relatedness/duplication, and Mendelian inconsistency. 2) Individual genotypes, variants, and
                            samples&#8217; checks (e.g. average read depth, average genotype quality scores, and
                            departure from Hardy-Weinberg Equilibrium) are done next. Variants are flagged when issues
                            arise. 3) Finally, improvements are assessed based on quality with the exclusion of
                            low-quality genotypes, variants, and samples as flagged in the second stage.{" "}
                        </p>

                        <p className="wp-block-paragraph">
                            To learn more about QC Pipeline please read{" "}
                            <a href="https://www.ncbi.nlm.nih.gov/pubmed/29857119">our publication</a>.
                        </p>

                        <div /*style="height:50px"*/ aria-hidden="true" className="wp-block-spacer"></div>

                        <h3 className="wp-block-heading">Annotation pipeline </h3>

                        <div className="wp-block-image">
                            <figure className="aligncenter size-large"></figure>
                        </div>
                        <p className="wp-block-paragraph">
                            The pipeline generates variant-level assessments of functional impact on genes and genetic
                            regulation. Our pipeline is based upon the Ensembl Variant Effect Predictor, which overlays
                            exon, transcript, and regulatory element information from the Ensembl database to generate
                            all possible consequences (missense, frameshift, splicing, etc) a variant may have. Variant
                            consequences relative to Ensembl/GENCODE transcripts are assigned an impact category (high,
                            moderate, low, etc), and multiple variant scoring approaches are incorporated (CADD, CATO,
                            etc).{" "}
                        </p>

                        <p className="wp-block-paragraph">
                            Learn more about{" "}
                            <a href="https://www.ncbi.nlm.nih.gov/pubmed/29590295">GCAD annotation pipeline</a>.
                        </p>
                    </div>
                </div>
            </div>
            <footer className="entry-footer">
                <div className="entry-taxonomies"></div>
                <div className="entry-actions"></div>
            </footer>
        </article>
    );
};

export default GcadDataSummary;
