import CategoryBanner from '../Category/CategoryBanner';
import BrowseCategories from '../Category/BrowseCategories';
import RelatedProductArea from '../common/relatedProductArea';
import Modal from '../Category/Modal';
import ProductShow from '../Category/ProductShow';
import { useEffect } from 'react';
export default function Category () {
	useEffect(() => {
		window.scrollTo(0, 0);
	  }, []);
	return (
		<div>
			<CategoryBanner />
			<div class="container">
				<div class="row">
					<BrowseCategories />	
					<ProductShow />
				</div>
			</div>
			<RelatedProductArea />
			<Modal />
		</div>
	)
}
