const metaRouters = import.meta.glob("./modules/**/*.js", {
    eager: true
});
console.log(metaRouters);

export const routerArray = [];

let routes = {};

Object.keys(metaRouters).forEach((item) => {
    Object.keys(metaRouters[item]).forEach(key => {
        routerArray.push(metaRouters[item][key])
        routes = Object.assign(metaRouters[item][key],routes)
    })


});

console.log(routes)
export default routes;