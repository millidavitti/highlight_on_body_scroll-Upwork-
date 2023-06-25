const sections = document.querySelectorAll("section");
const links = document.querySelectorAll("li");
const linkRack = document.querySelector(".container");

function sectionCb(entries) {
	entries.forEach((entry) => {
		const link = document.querySelector("." + entry.target.id);

		// Section Entries
		if (entry.isIntersecting && entry.target.dataset.sect === "sect") {
			link.classList.add("active");
		} else if (!entry.isIntersecting && entry.target.dataset.sect === "sect")
			link.classList.remove("active");
	});

	//Scroll Into View.
	const el = document.querySelector(".active");
	const elem = el.getBoundingClientRect();
	const scroll = { len: elem.width };
	const index = +el.dataset.index;

	for (let i = 0; i < index; i++) {
		scroll.len += links[i].getBoundingClientRect().width;
	}

	// If active
	if (el.classList.contains("active")) {
		// If visible
		if (isElemVisible(el, linkRack).isVisible) {
			return;
		}
		// if not visible and if Downwards
		else if (!isElemVisible(el, linkRack).isVisible) {
			// From the right
			if (
			elem.right >
				linkRack.getBoundingClientRect().width
			)
				linkRack.scrollTo({
					left: Math.abs(
						linkRack.getBoundingClientRect().width -
							(scroll.len + 20 * (index + 1)),
					),
					behavior: "smooth",
				});
			// From the left
			else if (elem.left < 0)
				linkRack.scrollTo({
					left: 20 * index,
					behavior: "smooth",
				});
		}
	}
}

const observer = new IntersectionObserver(sectionCb, {
	root: null,
	threshold: [0.5, 0.75],
});
sections.forEach((section) => observer.observe(section));

function isElemVisible(element, view, threshold = 1) {
	// Overflow-X Support Only
	if (threshold < 0 || threshold > 1)
		throw new Error("Input values between 0 and 1");

	const left = element.getBoundingClientRect().left;
	const right = element.getBoundingClientRect().right;
	const width = element.offsetWidth;
	let ratio;

	if (left < 0) {
		ratio = Math.abs((width + left) / width);
	} else if (right > view.clientWidth && left < view.clientWidth)
		ratio = Math.abs((width - (right - view.clientWidth)) / width);
	else if (left >= view.clientWidth) ratio = 0;
	else ratio = 1;

	if ((left < 0 || right < 0 || right > view.clientWidth) && ratio < threshold)
		return { isVisible: false, ratio };
	else return { isVisible: true, ratio };
}
