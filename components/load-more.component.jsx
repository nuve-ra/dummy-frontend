const LoadMoreData = ({ state, fetchDataFun }) => {
    if (state !== null && state.totalDocs > state.results.length) {
        return (
            <button
                onClick={()=>fetchDataFun({page:state.page + 1})} 
                className="btn-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" 
                
            >
                Load More
            </button>
        );    }
    null;
    // Return null if the button should not be rendered
};

export default LoadMoreData;