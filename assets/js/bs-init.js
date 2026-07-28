if (window.innerWidth < 768) {
	[].slice.call(document.querySelectorAll('[data-bss-disabled-mobile]')).forEach(function (elem) {
		elem.classList.remove('animated');
		elem.removeAttribute('data-bss-hover-animate');
		elem.removeAttribute('data-aos');
		elem.removeAttribute('data-bss-parallax-bg');
		elem.removeAttribute('data-bss-scroll-zoom');
	});
}

(function () {
	var root = document.documentElement;
	var resizeRaf = null;
	var lastBucket = '';

	function getViewportBucket() {
		var width = window.innerWidth || root.clientWidth;
		if (width < 576) return 'xs';
		if (width < 768) return 'sm';
		if (width < 992) return 'md';
		if (width < 1200) return 'lg';
		return 'xl';
	}

	function applyViewportScales() {
		var bucket = getViewportBucket();
		if (bucket === lastBucket) return;
		lastBucket = bucket;

		var scales = {
			xs: { paragraph: 0.95, heading: 0.92, divider: 0.9, control: 0.92, link: 0.95 },
			sm: { paragraph: 0.98, heading: 0.97, divider: 0.95, control: 0.97, link: 0.98 },
			md: { paragraph: 1, heading: 1, divider: 1, control: 1, link: 1 },
			lg: { paragraph: 1.04, heading: 1.04, divider: 1.02, control: 1.02, link: 1.02 },
			xl: { paragraph: 1.08, heading: 1.08, divider: 1.08, control: 1.05, link: 1.04 }
		}[bucket];

		root.style.setProperty('--th-paragraph-scale', String(scales.paragraph));
		root.style.setProperty('--th-heading-scale', String(scales.heading));
		root.style.setProperty('--th-divider-scale', String(scales.divider));
		root.style.setProperty('--th-control-scale', String(scales.control));
		root.style.setProperty('--th-link-scale', String(scales.link));
	}

	function getWordCount(text) {
		var cleaned = (text || '').trim();
		return cleaned ? cleaned.split(/\s+/).length : 0;
	}

	function analyzeParagraphIntent() {
		document.querySelectorAll('p').forEach(function (paragraph) {
			var words = getWordCount(paragraph.textContent);
			var scale = 1;

			if (words > 90) scale -= 0.08;
			else if (words > 45) scale -= 0.03;
			else if (words > 0 && words < 18) scale += 0.07;

			if (paragraph.querySelector('strong, em, b, i')) scale += 0.02;
			paragraph.style.setProperty('--th-intent-scale', Math.max(0.86, Math.min(1.14, scale)).toFixed(3));
		});
	}

	function analyzeHeadingIntent() {
		document.querySelectorAll('h1, h2, h3, h4, h5, h6, .display-1, .display-2, .display-3, .display-4, .display-5, .display-6, .h1, .h2, .h3, .h4, .h5, .h6').forEach(function (heading) {
			var words = getWordCount(heading.textContent);
			var scale = 1;
			var tagName = heading.tagName.toLowerCase();
			var text = (heading.textContent || '').trim();
			var uppercaseRatio = text ? ((text.match(/[A-Z]/g) || []).length / text.length) : 0;

			if (tagName === 'h1' || heading.classList.contains('display-1') || heading.classList.contains('h1')) scale += 0.18;
			else if (tagName === 'h2' || heading.classList.contains('display-2') || heading.classList.contains('h2')) scale += 0.1;
			else if (tagName === 'h3' || heading.classList.contains('display-3') || heading.classList.contains('h3')) scale += 0.05;

			if (words > 8) scale -= 0.12;
			else if (words > 5) scale -= 0.06;
			else if (words > 0 && words <= 3) scale += 0.05;

			if (uppercaseRatio > 0.75 && words > 1) scale -= 0.04;
			heading.style.setProperty('--th-intent-scale', Math.max(0.88, Math.min(1.26, scale)).toFixed(3));
		});
	}

	function analyzeDividerIntent() {
		document.querySelectorAll('hr').forEach(function (divider) {
			var scale = 1;
			var prev = divider.previousElementSibling;
			var next = divider.nextElementSibling;
			if (prev && /H[1-6]/.test(prev.tagName)) scale += 0.14;
			if (next && /H[1-6]/.test(next.tagName)) scale += 0.08;
			divider.style.setProperty('--th-intent-scale', Math.max(0.85, Math.min(1.2, scale)).toFixed(3));
		});
	}

	function analyzeTypographyIntent() {
		analyzeParagraphIntent();
		analyzeHeadingIntent();
		analyzeDividerIntent();
	}

	function onResize() {
		if (resizeRaf !== null) return;
		resizeRaf = window.requestAnimationFrame(function () {
			applyViewportScales();
			resizeRaf = null;
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		analyzeTypographyIntent();
		applyViewportScales();
		window.addEventListener('resize', onResize, { passive: true });
	}, false);
})();