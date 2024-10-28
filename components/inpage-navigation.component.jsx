import { useState, useRef, useEffect } from "react";

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    const activeTabLineRef = useRef();
    const activeTabRef = useRef();
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const changePageState = (index) => {
        const btn = activeTabRef.current;
        if (!btn) return;

        const { offsetWidth, offsetLeft } = btn.getBoundingClientRect();
        const parentOffsetLeft = activeTabLineRef.current.parentElement.getBoundingClientRect().left;

        activeTabLineRef.current.style.width = `${offsetWidth}px`;
        activeTabLineRef.current.style.left = `${offsetLeft - parentOffsetLeft}px`;

        setInPageNavIndex(index);
    };

    useEffect(() => {
        changePageState(defaultActiveIndex);
    }, [defaultActiveIndex]);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {routes.map((route, i) => (
                    <button
                        ref={i === defaultActiveIndex ? activeTabRef : null}
                        key={i}
                        className={`p-4 px-5 capitalize ${inPageNavIndex === i ? "text-black" : "text-dark-grey"} ${defaultHidden.includes(route) ? "hidden" : ""}`}
                        onClick={() => changePageState(i)}
                        aria-selected={inPageNavIndex === i}
                        role="tab"
                    >
                        {route}
                    </button>
                ))}
                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
            </div>

            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InPageNavigation;