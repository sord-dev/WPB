
export const deduceType = (node, TypeMap) => {
    if(!TypeMap) throw new Error('TypeMap is required');
    
    const { type } = node;
    if (type) return TypeMap[type];
    return 'text';
}