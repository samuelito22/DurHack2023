import styles from "./styles.module.css";

function CategoryFilter({
  selectedColor,
  setSelectedColor,
  selectedClothingType,
  setSelectedClothingType,
  colors,
  clothingTypes,
}) {
  return (
    <div className={styles.filter_container}>
      <div className={styles.filter_section}>
        <label>
          <h3>Color:</h3>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">Everything</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.filter_section}>
        <label>
          <h3>Clothing Type:</h3>
          <select
            value={selectedClothingType}
            onChange={(e) => setSelectedClothingType(e.target.value)}
          >
            <option value="">Everything</option>
            {clothingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default CategoryFilter;
