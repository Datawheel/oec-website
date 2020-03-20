import React, {Component} from "react";
import Helmet from "react-helmet";

export default class Methodology extends Component {

  render() {
    return (
      <div className="methodology">
        <Helmet title="Methodology" />

        <h1>Methodology</h1>

        <p>In our Economic Complexity measures (RCA, ECI, ECI+, PCI and PCI+ explained below) we considered simultaneously:</p>

        <div className="highlight">Countries with population greater or equal to 1.25 million</div>

        <div className="highlight">Countries whose traded value is greater or equal than 1 billion</div>

        <div className="highlight">Products whose traded value is greater or equal than 10 million</div>

        <p>The idea here being to avoid distortions.</p>

        <h2>Revealed Compared Advantage (RCA)</h2>

        <h4>Which countries make which products?</h4>

        <p>When associating countries to products it is important to take into account the size of the export volume of countries and that of the world trade of products. This is because, even for the same product, we expect the volume of exports of a large country like China, to be larger than the volume of exports of a small country like Uruguay. By the same token, we expect the export volume of products that represent a large fraction of world trade, such as cars or footwear, to represent a larger share of a country&apos;s exports than products that account for a small fraction of world trade, like cotton seed oil or potato flour.</p>

        <p>To make countries and products comparable we use Balassa&apos;s definition of Revealed Comparative Advantage or RCA. Balassa&apos;s definition says that a country has Revealed Comparative Advantage in a product if it exports more than its &quot;fair&quot; share, that is, a share that is equal to the share of total world trade that the product represents. For example, in 2008, with exports of $42 billion, soybeans represented 0.35% of world trade. Of this total, Brazil exported nearly $11 billion, and since Brazil&apos;s total exports for that year were $140 billion, soybeans accounted for 7.8% of Brazil&apos;s exports. This represents around 22 times Brazil&apos;s “fair share” of soybean exports (7.8% divided by 0.35%), so we can say that Brazil has revealed comparative advantage in soybeans.</p>

        <h4>How can we express this mathematically?</h4>

        <p>Let:</p>

        <p>Define MATH​​ as:</p>

        <p>We use this measure to construct a matrix, MATH that connects each country to the products that it makes.</p>

        <p>With entries:</p>

        <p>In our research we have played around with cutoff values other than 1 to construct the MATH​​ matrix and found that our results are robust to these changes.</p>

        <h2>What is Economic Complexity?</h2>

        <p>We owe to Adam Smith the idea that the division (specialization) of labor is the secret of the wealth of nations. In a modern interpretation, the division of labor into markets and organizations is what allows the knowledge held by few to reach many, making us collectively wiser.</p>

        <p>The complexity of an economy is related to the multiplicity of useful knowledge embedded in it. Because individuals are limited in what they know, the only way societies can expand their knowledge base is by facilitating the interaction of individuals in increasingly complex networks in order to make products. We can measure economic complexity by the mix of these products that countries are able to make.</p>

        <p>Some products, like medical imaging devices or jet engines, embed large amounts of knowledge and are the results of very large networks of people and organizations. These products cannot be made in simpler economies that are missing parts of this network’s capability set. Economic complexity, therefore, is expressed in the composition of a country’s productive output and reflects the structures that emerge to hold and combine knowledge.</p>

        <h2>How is Economic Complexity calculated?</h2>

        <p>We can measure diversity and ubiquity simply by summing over the rows or columns of the matrix MATH​​. Formally, we define:</p>

        <p>To generate a more accurate measure of the number of capabilities available in a country, or required by a product, we need to correct the information that diversity and ubiquity carry by using each one to correct the other. For countries, this requires us to calculate the average ubiquity of the products that it exports, the average diversity of the countries that make those products and so forth. For products, this requires us to calculate the average diversity of the countries that make them and the average ubiquity of the other products that these countries make. This can be expressed by the recursion:</p>

        <p>We then insert (4) into (3) to obtain</p>

        <p>and rewrite this as:</p>

        <p>where</p>

        <p>We note (7) is satisfied when MATH.This is the eigenvector of MATH​​​​ which is associated with the largest eigenvalue. Since this eigenvector is a vector of ones, it is not informative. We look, instead, for the eigenvector associated with the second largest eigenvalue. This is the eigenvector that captures the largest amount of variance in the system and is our measure of economic complexity. Hence, we define the Economic Complexity Index (ECI) as:</p>

        <p>where {"< >"} represents an average, stdev stands for the standard deviation and</p>

        <p>Analogously, we define a Product Complexity Index (PCI). Because of the symmetry of the problem, this can be done simply by exchanging the index of countries (c) with that for products (p) in the definitions above. Hence, we define PCI as:</p>

      </div>
    );
  }
}
