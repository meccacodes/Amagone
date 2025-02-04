"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/types.js";
import { useForm } from "react-hook-form";
import { RootState } from "../store/types.js";
import { yupResolver } from "@hookform/resolvers/yup";
import { search } from "../store/slices/apiSlice";
import * as yup from "yup";
import { useEffect } from "react";

export const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const success = useSelector((state: RootState) => state.success);

  const schema = yup.object({
    input: yup.string().required("Please enter a search term."),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const searchQuery = (data: { input: string }) => {
    dispatch(search(data.input));
    setValue("input", "");
  };

  useEffect(() => {
    if (success) {
      console.log(success);
    }
  }, [success]);

  return (
    <main>
      <input
        {...register("input", { required: true })}
        type="text"
        placeholder="What are you looking for today?"
      />
      <button onClick={handleSubmit(searchQuery)}>Search</button>
      <div>{errors.input?.message && <div>{errors.input?.message}</div>}</div>
    </main>
  );
};
