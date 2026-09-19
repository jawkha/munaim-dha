export function resolve(specifier,context,nextResolve){
 return nextResolve(specifier==='three'?new URL('../site/assets/three.module.js',import.meta.url).href:specifier,context);
}
