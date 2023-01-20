# Type Checking With Sorbet

The majority of the code in Homebrew is written in Ruby which is a dynamic language. To avail the benefits of static type checking, we have set up Sorbet in our codebase which provides the benefits of static type checking to dynamic languages like Ruby.

The [Sorbet Documentation] is a good place to get started if you want to dive deeper into Sorbet and its abilities.

## Sorbet in the Homebrew Codebase

### Inline Type Annotations

To add type annotations to a class or module, we extend it with the `T::Sig` module (read this as `Type::Signature`). This adds the `sig` method which is used to annotate method signatures. Here's a simple example:

```ruby
class MyClass
  extend T::Sig

  sig { params(name: String).returns(String) }
  def my_method(name)
    "Hello, #{name}!"
  end
end
```

With `params` we specify that there is a parameter `name` which must be a `String`, and with `returns` we specify that this method always returns a `String`.

For more information on how to express more complex types, refer to the official documentation:

- [Method Signatures](https://sorbet.org/docs/sigs)
- [Class Types](https://sorbet.org/docs/class-types)
- [Nilable Types](https://sorbet.org/docs/nilable-types)
- [Union Types](https://sorbet.org/docs/union-types)

### Ruby Interface Files (`.rbi`)

[RBI files](https://sorbet.org/docs/rbi) help Sorbet learn about constants, ancestors and methods defined in ways it doesn’t understand natively. We can also create an RBI file to help Sorbet understand dynamic definitions.

Sometimes it is necessary to explicitly include the `Kernel` module in order for Sorbet to know that methods such as `puts` are available in a given context. This is mostly necessary for modules since they can be used in both `BasicObject`s (which don't include `Kernel`) and `Object`s (which include `Kernel` by default). In this case, it is necessary to create an `.rbi` file ([example]) since re-including the `Kernel` module in actual code can break things.

[example]: https://github.com/Homebrew/brew/blob/61b79318ed089b5010501e2cbf163fd8e48e2dfc/Library/Homebrew/global.rbi

### The [`Library/Homebrew/sorbet`] Directory

[`Library/Homebrew/sorbet`]: https://github.com/Homebrew/brew/tree/master/Library/Homebrew/sorbet

- The `rbi` directory contains all Ruby Interface (`.rbi`) files auto-generated by running `brew typecheck --update`:

  - RBI files for all gems are generated using [Tapioca](https://github.com/Shopify/tapioca#tapioca).
  - Definitions for dynamic code (i.e. meta-programming) are generated using `srb rbi hidden-definitions`.
  - Definitions for missing constants are generated using `srb rbi todo`.

- The `config` file is a newline-separated list of arguments to pass to `srb tc`, the same as if they’d been passed on the command line. Arguments in the config file are always passed first, followed by arguments provided on the command line. We use it to ignore Gem directories which we do not wish to type check.

- Every Ruby file in the codebase has a magic `# typed: <level>` comment at the top, where `<level>` is one of [Sorbet's strictness levels], usually `false`, `true` or `strict`. The `false` files only report errors related to the syntax, constant resolution and correctness of the method signatures, but no type errors. Our long-term goal is to move all `false` files to `true` and start reporting type errors on those files as well. Therefore, when adding new files, you should ideally mark it with `# typed: true` and work out any resulting type errors.

[Sorbet's strictness levels]: https://sorbet.org/docs/static#file-level-granularity-strictness-levels

## Using `brew typecheck`

When run without any arguments, `brew typecheck`, will run considering the strictness levels set in each of the individual Ruby files in the core Homebrew codebase. However, when it is run on a specific file or directory, more errors may show up since Sorbet cannot resolve constants defined outside the scope of the specified file. These problems can be solved with RBI files. Currently `brew typecheck` provides `--quiet`, `--file`, `--dir` and `--ignore` options but you can explore more options with `srb tc --help` and pass them with `srb tc`.

## Resolving Type Errors

Sorbet reports type errors along with an error reference code, which can be used to look up more information on how to debug the error, or what causes the error in the [Sorbet Documentation]. Here is how to debug some common type errors:

- Using `T.reveal_type`: in files which are `true` or higher, by wrapping a variable or method call in `T.reveal_type`, Sorbet will show us what type it thinks that variable has in the output of `srb tc`. This is particularly useful when writing [method signatures](https://sorbet.org/docs/sigs) and debugging. Make sure to remove this line from your code before committing your changes, since this is just a debugging tool.

- One of the most frequent errors that we've encountered is `7003: Method does not exist.` Since Ruby is a very dynamic language, methods can be defined in ways Sorbet cannot see statically. In such cases, check if the method exists at runtime; if not, then Sorbet has caught a future bug! But, it is also possible that even though a method exists at runtime, Sorbet cannot see it. In such cases, we use [`.rbi` files](#ruby-interface-files-rbi).

- Since Sorbet does not automatically assume that Kernel is to be included in Modules, we may encounter many errors while trying to use methods like `puts`, `ohai`, `odebug` etc. A simple workaround for this is to add an extra `include Kernel` line in the respective RBI file.

- The tips above are very generic and apply to lots of cases. For some common gotchas when using Sorbet, refer to the [Sorbet Error Reference](https://sorbet.org/docs/error-reference) and [FAQ](https://sorbet.org/docs/faq).

[Sorbet Documentation]: https://sorbet.org/docs/overview