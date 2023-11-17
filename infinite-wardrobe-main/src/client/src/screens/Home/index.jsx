import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Components from "../../components";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import styles from "./styles.module.css";

function Home() {
  const [data, setData] = useState({ info: "", clothing: [] });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedClothingType, setSelectedClothingType] = useState("");
  const [colors, setColors] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);

  useEffect(() => {
    // Fetch users from the API
    axios
      .get("/api/clothing")
      .then((response) => {
        if (response.data && Array.isArray(response.data.clothing)) {
          setData(response.data);
          const unqiueColors = [
            ...new Set(response.data.clothing.map((item) => item.colour)),
          ];
          const unqiueTypes = [
            ...new Set(response.data.clothing.map((item) => item.category)),
          ];
          setColors(unqiueColors);
          setClothingTypes(unqiueTypes);
          // console.log(unqiueColors);
          // console.log(unqiueTypes);
        } else {
          console.error("API did not return the expected structure");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  // console.log(data.clothing);

  return (
    <div>
      <CategoryFilter
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedClothingType={selectedClothingType}
        setSelectedClothingType={setSelectedClothingType}
        clothingTypes={clothingTypes}
        colors={colors}
      />
      {(() => {
        const items = [];
        data.clothing.forEach((item) => {
          if (item.colour == selectedColor || selectedColor == "") {
            if (
              item.category == selectedClothingType ||
              selectedClothingType == ""
            ) {
              items.push(
                <Components.Card
                  imgUrl={item.imageString}
                  title={item.category}
                />
              );
            }
          }
        });
        return items;
      })()}
    </div>
  );
}

export default Home;
