const solts = {
    default: ({ row, column }) => {
        const cellValue = row[column.field];
        const type = cellValue === "admin" ? "" : "warning";
        return [<span class={`el-tag el-tag--${type} el-tag--plain`}>{cellValue}</span>];
    }
};
export default solts;
//# sourceMappingURL=RoleColumnSolts.jsx.map