import { describe, expect, it } from "vitest";
import reducer, {
  addItem,
  clearCart,
  removeItem,
  updateQuantity,
} from "@/store/cart-slice";
import { mockProductA, mockProductB } from "@/__mocks__/products";

describe("cart slice", () => {
  it("starts empty", () => {
    expect(reducer(undefined, { type: "@@INIT" }).items).toEqual([]);
  });

  it("addItem adds a new product with quantity 1", () => {
    const state = reducer(undefined, addItem(mockProductA));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ product: mockProductA, quantity: 1 });
  });

  it("addItem increments quantity for an existing product", () => {
    const afterFirst = reducer(undefined, addItem(mockProductA));
    const afterSecond = reducer(afterFirst, addItem(mockProductA));
    expect(afterSecond.items).toHaveLength(1);
    expect(afterSecond.items[0].quantity).toBe(2);
  });

  it("addItem keeps distinct products separate", () => {
    let state = reducer(undefined, addItem(mockProductA));
    state = reducer(state, addItem(mockProductB));
    expect(state.items).toHaveLength(2);
  });

  it("removeItem removes by product id", () => {
    let state = reducer(undefined, addItem(mockProductA));
    state = reducer(state, addItem(mockProductB));
    state = reducer(state, removeItem(mockProductA.id));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(mockProductB.id);
  });

  it("removeItem is a no-op for unknown ids", () => {
    const state = reducer(undefined, addItem(mockProductA));
    expect(reducer(state, removeItem(999)).items).toHaveLength(1);
  });

  it("updateQuantity sets the quantity", () => {
    let state = reducer(undefined, addItem(mockProductA));
    state = reducer(
      state,
      updateQuantity({ id: mockProductA.id, quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("updateQuantity <= 0 removes the item", () => {
    let state = reducer(undefined, addItem(mockProductA));
    state = reducer(
      state,
      updateQuantity({ id: mockProductA.id, quantity: 0 }),
    );
    expect(state.items).toEqual([]);

    state = reducer(undefined, addItem(mockProductA));
    state = reducer(
      state,
      updateQuantity({ id: mockProductA.id, quantity: -1 }),
    );
    expect(state.items).toEqual([]);
  });

  it("updateQuantity is a no-op for unknown ids", () => {
    const state = reducer(undefined, addItem(mockProductA));
    expect(
      reducer(state, updateQuantity({ id: 999, quantity: 3 })).items,
    ).toHaveLength(1);
  });

  it("clearCart empties the cart", () => {
    let state = reducer(undefined, addItem(mockProductA));
    state = reducer(state, addItem(mockProductB));
    expect(reducer(state, clearCart()).items).toEqual([]);
  });
});
