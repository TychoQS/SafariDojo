const Footer = () => {
    return (
        <footer className="flex flex-col items-center text-center p-4">
            <div className="flex justify-center items-center gap-10 w-full">
                <ul className="flex gap-4 list-none p-0 m-0">
                    {[
                        { href: "https://github.com/TychoQS/PS-Project", src: "/images/github.svg", alt: "GitHub" },
                        { href: "#", src: "/images/instagram.svg", alt: "Instagram" }
                    ].map((icon, index) => (
                        <li key={index}>
                            <a href={icon.href} target="_blank" rel="noopener noreferrer">
                                <img className="w-8 transition-transform duration-300 ease-in-out hover:scale-110" src={icon.src} alt={icon.alt} />
                            </a>
                        </li>
                    ))}
                </ul>
                <ul className="flex gap-4 list-none p-0 m-0 items-center">
                    <li>
                        <a className="transition-all duration-300 ease-in-out hover:text-orange-300 hover:shadow-lg hover:scale-110" href="#">Privacy Policy</a>
                    </li>
                    <li>
                        <hr className="border-0 w-[1.5px] h-3 bg-black" />
                    </li>
                    <li>
                        <a className="transition-all duration-300 ease-in-out hover:text-orange-300 hover:shadow-lg hover:scale-110" href="mailto:ayman.asbai101@alu.ulpgc.es">Contact</a>
                    </li>
                </ul>
            </div>
            <ul className="text-center mt-4 list-none p-0">
                <li>&copy; Copyright 2025 Safari Dojo. All rights reserved.</li>
            </ul>
        </footer>
    );
};

export default Footer;
