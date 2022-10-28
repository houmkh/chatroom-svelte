const metaRouters = import.meta.glob("./modules/*.js", {
    eager: true
});

export const routerArray = [];
Object.keys(metaRouters).forEach((item)=>{
    Object.keys(metaRouters[item]).forEach(key=>{
        routerArray.push(...metaRouters[item][key]);
    })

})